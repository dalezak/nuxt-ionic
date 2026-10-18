import WidgetKit
import SwiftUI

// ─────────────────────────────────────────────────────────────────────────────
// DayWidget — the day's steps, on the home screen and lock screen.
//
// SHARED FILE. The source of truth is `nuxt-ionic/native/ios/DayWidget.swift`;
// every app copies it into its widget extension unchanged with
// `npm run widget:copy`. Edit it in nuxt-ionic, never in an app — a local edit
// is overwritten by the next copy.
//
// Everything app-specific lives OUTSIDE this file, so it never needs a fork:
//
//   • Widget Info.plist (static — needed before the app has ever run):
//       DayWidgetAppGroup     App Group shared with the app, e.g. group.com.example.app
//       DayWidgetName         name in the widget gallery, e.g. "Today's Path"
//       DayWidgetDescription  one line under it in the gallery
//   • Payload (written by `publishDayWidget()` in nuxt-ionic): header labels,
//     the tap URL, and the steps themselves.
//   • Asset catalog: `AccentColor` colours the done ticks — set it to the app's
//     own accent, or iOS falls back to system blue.
//
// Nothing here talks to the webview or the network: a widget is a separate
// process, so the ONLY contract is the JSON decoded below, and the only thing
// the app can do is keep it true.
//
// Design rules carried over from the product, not decoration:
//   • No streak, no percentage, no "days since". A home screen is the most
//     persistent surface there is and the user cannot close it, so guilt
//     loops are ruled out here most of all.
//   • Progress is scoped to ONE day ("2 of 4") and resets by morning.
//   • The completed state is a warm close, not a score.
//
// DEPLOYMENT TARGET: needs **iOS 17+** — `containerBackground(for:)` is 17.
// Keep EVERY target in the app's Xcode project at the same minimum: `cap sync`
// copies the FIRST `IPHONEOS_DEPLOYMENT_TARGET` in project.pbxproj into
// CapApp-SPM's Package.swift, and a new extension's config sorts first. Xcode's
// default for a new extension (26.x) became `.iOS(.v26)`, which the package's
// tools version can't parse, and every build failed at package resolution.
// ─────────────────────────────────────────────────────────────────────────────

private let payloadKey = "day"

private func info(_ key: String) -> String? {
    Bundle.main.object(forInfoDictionaryKey: key) as? String
}

private let appGroup = info("DayWidgetAppGroup") ?? ""
private let appName = info("CFBundleDisplayName") ?? "the app"

struct Step: Decodable, Hashable {
    let id: String
    let title: String
    let done: Bool
}

struct DayPayload: Decodable {
    let label: String
    let shortLabel: String
    let url: String?
    let steps: [Step]
    let nextTitle: String?
    let nextDetail: String?
    let headline: String
    let doneCount: Int
    let total: Int
    let day: String?

    // What a freshly-placed widget shows before the app has ever published:
    // an honest prompt rather than invented steps — this file doesn't know
    // what any app's steps are called.
    static let placeholder = DayPayload(
        label: "Today", shortLabel: "Today", url: nil,
        steps: [],
        nextTitle: nil, nextDetail: nil,
        headline: "Open \(appName) to set today.",
        doneCount: 0, total: 0, day: nil
    )

    var complete: Bool { total > 0 && doneCount >= total }
    var tapURL: URL? { url.flatMap(URL.init(string:)) }
}

struct DayEntry: TimelineEntry {
    let date: Date
    let payload: DayPayload
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> DayEntry {
        DayEntry(date: Date(), payload: .placeholder)
    }

    func getSnapshot(in context: Context, completion: @escaping (DayEntry) -> Void) {
        completion(DayEntry(date: Date(), payload: read() ?? .placeholder))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<DayEntry>) -> Void) {
        let entry = DayEntry(date: Date(), payload: read() ?? .placeholder)
        // `.after(nextMidnight)` rather than a short interval: the payload only
        // changes when the user does something, and the app requests a reload
        // itself at that moment. The daily refresh exists so a day that ends
        // untouched rolls over instead of showing yesterday.
        let midnight = Calendar.current.nextDate(
            after: Date(), matching: DateComponents(hour: 0, minute: 1),
            matchingPolicy: .nextTime
        ) ?? Date().addingTimeInterval(3600)
        completion(Timeline(entries: [entry], policy: .after(midnight)))
    }

    private func read() -> DayPayload? {
        guard let defaults = UserDefaults(suiteName: appGroup),
              let raw = defaults.string(forKey: payloadKey),
              let data = raw.data(using: .utf8),
              let payload = try? JSONDecoder().decode(DayPayload.self, from: data)
        else { return nil }
        // Yesterday's payload after midnight, before the app has been opened:
        // show the fresh-day prompt rather than yesterday's ticks as today's.
        if let day = payload.day, day != Self.today() { return nil }
        return payload
    }

    private static func today() -> String {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: Date())
    }
}

// One filled dot per closed step. The row IS the day's shape — legible at a
// glance without reading a word, which is the only thing a widget reliably gets.
struct StepDots: View {
    let steps: [Step]

    var body: some View {
        HStack(spacing: 6) {
            ForEach(steps, id: \.self) { step in
                Circle()
                    .fill(step.done ? Color.accentColor : Color.secondary.opacity(0.25))
                    .frame(width: 8, height: 8)
                    .accessibilityLabel("\(step.title): \(step.done ? "done" : "open")")
            }
        }
    }
}

struct DayWidgetEntryView: View {
    @Environment(\.widgetFamily) private var family
    var entry: DayEntry

    private var payload: DayPayload { entry.payload }

    var body: some View {
        switch family {
        case .accessoryRectangular: rectangularAccessory
        case .systemMedium:         medium
        default:                    small
        }
    }

    // ── Small — a glance ─────────────────────────────────────────────────────
    private var small: some View {
        VStack(alignment: .leading, spacing: 8) {
            header
            Text(payload.headline)
                .font(.footnote).fontWeight(.medium)
                .lineLimit(3)
                .minimumScaleFactor(0.9)
                .fixedSize(horizontal: false, vertical: true)
            if let title = payload.nextTitle, payload.nextDetail != nil {
                Text(title.uppercased())
                    .font(.system(size: 9, weight: .semibold))
                    .foregroundStyle(.secondary)
            }
            Spacer(minLength: 0)
            StepDots(steps: payload.steps)
        }
        .padding(14)
        .containerBackground(for: .widget) { Color(.systemBackground) }
        .widgetURL(payload.tapURL)
    }

    // ── Medium — the steps NAMED ─────────────────────────────────────────────
    // The extra width buys the one thing the small size cannot show: WHICH
    // steps are closed, without the user having to remember what the dots
    // stand for.
    private var medium: some View {
        VStack(alignment: .leading, spacing: 10) {
            header
            Text(payload.headline)
                .font(.subheadline).fontWeight(.medium)
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)
            Spacer(minLength: 0)
            HStack(spacing: 12) {
                ForEach(payload.steps, id: \.self) { step in
                    HStack(spacing: 5) {
                        Image(systemName: step.done ? "checkmark.circle.fill" : "circle")
                            .font(.system(size: 11))
                            .foregroundStyle(step.done ? Color.accentColor : Color.secondary.opacity(0.45))
                        Text(step.title)
                            .font(.caption2)
                            .foregroundStyle(step.done ? .secondary : .primary)
                            // The OPEN step is the one worth reading, so the
                            // closed ones recede rather than being struck out —
                            // nothing here should look like a failed item.
                            .fontWeight(step.done ? .regular : .semibold)
                            // One line, always. Without this the semibold open
                            // steps ran out of width and hyphenated ("Prac-
                            // tice") on a real device; shrink a touch instead.
                            .lineLimit(1)
                            .minimumScaleFactor(0.8)
                    }
                }
                Spacer(minLength: 0)
            }
        }
        .padding(16)
        .containerBackground(for: .widget) { Color(.systemBackground) }
        .widgetURL(payload.tapURL)
    }

    // ── Lock screen — the one people actually see ────────────────────────────
    // Rendered MONOCHROME and vibrancy-tinted by the system: colour carries no
    // information here, so state is shown with filled vs hollow glyphs and
    // weight instead. The container background is CLEAR — the system provides
    // the real one, and painting a colour produces a grey slab on the
    // wallpaper; it is declared only because iOS 17 asks every family for one.
    //
    // PRIVACY: a lock screen is read by anyone who glances at the phone. Only
    // the app's own vocabulary belongs here (a step name, a practice title) —
    // never anything the user wrote, which is why the payload carries none.
    private var rectangularAccessory: some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack(spacing: 4) {
                Image(systemName: payload.complete ? "checkmark.circle.fill" : "circle.dotted")
                    .font(.system(size: 11))
                Text(payload.complete || payload.total == 0
                     ? payload.label
                     : "\(payload.doneCount) of \(payload.total) today")
                    .font(.caption2).fontWeight(.semibold)
            }
            Text(payload.headline)
                .font(.caption2)
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)
        }
        .containerBackground(for: .widget) { Color.clear }
        .widgetURL(payload.tapURL)
    }

    private var header: some View {
        HStack {
            // The small family can't fit a long label beside the count and
            // truncated it ("Today's…"); fall back to the short one there.
            ViewThatFits(in: .horizontal) {
                Text(payload.label)
                Text(payload.shortLabel)
            }
            .font(.caption).fontWeight(.semibold)
            .foregroundStyle(.secondary)
            .lineLimit(1)
            Spacer()
            if !payload.complete && payload.total > 0 {
                Text("\(payload.doneCount) of \(payload.total)")
                    .font(.caption2).foregroundStyle(.secondary)
            }
        }
    }
}

@main
struct DayWidget: Widget {
    let kind = "DayWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            DayWidgetEntryView(entry: entry)
        }
        .configurationDisplayName(info("DayWidgetName") ?? "Today")
        .description(info("DayWidgetDescription") ?? "What's still open today.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular])
    }
}

// ── Previews ─────────────────────────────────────────────────────────────────
// The fast loop: these render in Xcode's canvas with no device, no simulator
// and no app run. The step names are sample data only — the real ones come
// from each app's payload.

private extension DayPayload {
    static let sampleSteps = [
        Step(id: "commit", title: "Commit", done: true),
        Step(id: "learn", title: "Learn", done: true),
        Step(id: "practice", title: "Practice", done: false),
        Step(id: "reflect", title: "Reflect", done: false),
    ]

    // Mid-morning: two steps closed, a practice named as the next thing.
    static let midday = DayPayload(
        label: "Today's Path", shortLabel: "Today", url: nil,
        steps: sampleSteps,
        nextTitle: "Practice", nextDetail: "Notice One Bid",
        headline: "Notice One Bid", doneCount: 2, total: 4, day: nil
    )

    // Day closed — no count, warm close. Check this renders without a
    // trailing "4 of 4", which would turn a finish into a score.
    static let complete = DayPayload(
        label: "Today's Path", shortLabel: "Today", url: nil,
        steps: sampleSteps.map { Step(id: $0.id, title: $0.title, done: true) },
        nextTitle: nil, nextDetail: nil,
        headline: "Your day is complete.", doneCount: 4, total: 4, day: nil
    )

    // A long practice title — the case that breaks layouts.
    static let longTitle = DayPayload(
        label: "Today's Path", shortLabel: "Today", url: nil,
        steps: sampleSteps,
        nextTitle: "Practice", nextDetail: "Say the hard thing without the edge",
        headline: "Say the hard thing without the edge",
        doneCount: 2, total: 4, day: nil
    )
}

#Preview("Small", as: .systemSmall) {
    DayWidget()
} timeline: {
    DayEntry(date: .now, payload: .midday)
    DayEntry(date: .now, payload: .complete)
    DayEntry(date: .now, payload: .placeholder)
    DayEntry(date: .now, payload: .longTitle)
}

#Preview("Medium", as: .systemMedium) {
    DayWidget()
} timeline: {
    DayEntry(date: .now, payload: .midday)
    DayEntry(date: .now, payload: .complete)
    DayEntry(date: .now, payload: .longTitle)
}

#Preview("Lock screen", as: .accessoryRectangular) {
    DayWidget()
} timeline: {
    DayEntry(date: .now, payload: .midday)
    DayEntry(date: .now, payload: .complete)
    DayEntry(date: .now, payload: .longTitle)
}
