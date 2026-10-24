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

// One channel of today's ring: how far it got (0…1), its colour as hex, and its
// name for VoiceOver. Index 0 is the centre dot; the rest grow outward.
struct Ring: Decodable, Hashable {
    let value: Double
    let color: String?
    let title: String?
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
    // Optional: an app that sends no rings gets the dots-only layout it always
    // had, so this file stays identical across apps.
    var rings: [Ring]? = nil

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

extension Color {
    // "#RRGGBB" → Color; nil for anything else, so a bad value falls back to the
    // accent rather than to black.
    init?(hex: String?) {
        guard var s = hex?.trimmingCharacters(in: .whitespaces) else { return nil }
        if s.hasPrefix("#") { s.removeFirst() }
        guard s.count == 6, let v = UInt32(s, radix: 16) else { return nil }
        self.init(
            red: Double((v >> 16) & 0xFF) / 255,
            green: Double((v >> 8) & 0xFF) / 255,
            blue: Double(v & 0xFF) / 255
        )
    }
}

// Today's ring — the same mark as the app's <weekly-rings>, one day of it.
// Centre dot for the first channel, then concentric arcs outward, each filling
// clockwise from twelve o'clock. Geometry is copied from weekly-rings.vue (a
// 100-unit box): dot r 12, bands 9 wide with 3.6 gaps, so three rings close at
// the edge. Keep the two in step.
//
// The channels are INDEPENDENT on purpose: a light day still shows a real,
// partly filled mark, which is the whole point of the design. So there is no
// aggregate here — no total ring, no percentage.
//
// In tinted / vibrant rendering (lock screen, StandBy, tinted home screens)
// colour is stripped, so arcs draw in the primary ink and tracks fade.
struct RingGlyph: View {
    let rings: [Ring]
    let size: CGFloat
    @Environment(\.widgetRenderingMode) private var renderingMode

    private let dotR: CGFloat = 12
    private let width: CGFloat = 9
    private let gap: CGFloat = 3.6
    private let trackOpacity = 0.14

    private var fullColor: Bool { renderingMode == .fullColor }
    private var isEmpty: Bool { rings.allSatisfy { $0.value <= 0 } }

    private func ink(_ ring: Ring) -> Color {
        fullColor ? (Color(hex: ring.color) ?? .accentColor) : .primary
    }

    var body: some View {
        let u = size / 100
        ZStack {
            if let centre = rings.first {
                if isEmpty {
                    // A day with nothing in it yet: the shape it will take, as
                    // faint hairlines — never a different kind of mark.
                    Circle()
                        .stroke(Color.secondary.opacity(0.35), lineWidth: 3 * u)
                        .frame(width: 2 * dotR * u, height: 2 * dotR * u)
                } else {
                    Circle()
                        .fill(ink(centre).opacity(centre.value >= 1 ? 1 : trackOpacity))
                        .frame(width: 2 * dotR * u, height: 2 * dotR * u)
                }
            }
            ForEach(Array(rings.dropFirst().enumerated()), id: \.offset) { i, ring in
                let r = (dotR + gap + width / 2 + CGFloat(i) * (width + gap)) * u
                if isEmpty {
                    Circle()
                        .stroke(Color.secondary.opacity(0.35), lineWidth: 3 * u)
                        .frame(width: 2 * r, height: 2 * r)
                } else {
                    Circle()
                        .stroke(ink(ring).opacity(fullColor ? trackOpacity : 0.25), lineWidth: width * u)
                        .frame(width: 2 * r, height: 2 * r)
                    if ring.value > 0 {
                        Circle()
                            .trim(from: 0, to: min(1, ring.value))
                            .stroke(ink(ring), style: StrokeStyle(lineWidth: width * u, lineCap: .round))
                            .rotationEffect(.degrees(-90))
                            .frame(width: 2 * r, height: 2 * r)
                    }
                }
            }
        }
        .frame(width: size, height: size)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(accessibilityText)
    }

    // Per channel, in words — never one total.
    private var accessibilityText: String {
        rings.map { ring in
            let name = ring.title ?? "Step"
            if ring.value >= 1 { return "\(name) done" }
            if ring.value <= 0 { return "\(name) not yet" }
            return "\(name) partly done"
        }.joined(separator: ", ")
    }
}

struct DayWidgetEntryView: View {
    @Environment(\.widgetFamily) private var family
    var entry: DayEntry

    private var payload: DayPayload { entry.payload }

    var body: some View {
        switch family {
        case .accessoryRectangular: rectangularAccessory
        case .accessoryCircular:    circularAccessory
        case .systemMedium:         medium
        default:                    small
        }
    }

    // The ring, when the app sends one and it has a channel to draw.
    private var rings: [Ring]? {
        guard let r = payload.rings, !r.isEmpty else { return nil }
        return r
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
            // The ring says what the dots say and more (how FAR each beat got),
            // so it takes their place rather than stacking on them.
            if let rings {
                RingGlyph(rings: rings, size: 40)
            } else {
                StepDots(steps: payload.steps)
            }
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
            // The ring sits beside the header and headline, not beside the
            // ticks: the ticks need the full width to keep every step name on
            // one line.
            HStack(alignment: .top, spacing: 12) {
                VStack(alignment: .leading, spacing: 10) {
                    header
                    Text(payload.headline)
                        .font(.subheadline).fontWeight(.medium)
                        .lineLimit(2)
                        .fixedSize(horizontal: false, vertical: true)
                }
                if let rings {
                    RingGlyph(rings: rings, size: 52)
                }
            }
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

    // ── Lock screen, circular — the ring on its own ─────────────────────────
    // The one family a ring was made for. Without rings (an app that sends
    // none) it falls back to the day's count, still scoped to today.
    private var circularAccessory: some View {
        ZStack {
            if let rings {
                RingGlyph(rings: rings, size: 50)
            } else if payload.total > 0 {
                VStack(spacing: 0) {
                    Image(systemName: payload.complete ? "checkmark" : "circle.dotted")
                        .font(.system(size: 12, weight: .semibold))
                    if !payload.complete {
                        Text("\(payload.doneCount)/\(payload.total)")
                            .font(.system(size: 13, weight: .semibold))
                    }
                }
            } else {
                Image(systemName: "circle.dotted")
                    .font(.system(size: 20))
            }
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
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular, .accessoryCircular])
    }
}

// ── Previews ─────────────────────────────────────────────────────────────────
// The fast loop: these render in Xcode's canvas with no device, no simulator
// and no app run. The step names are sample data only — the real ones come
// from each app's payload.

private extension DayPayload {
    // The amber day ramp love-well sends (beat-dawn → beat-dusk). Sample only:
    // each app sends its own colours, already resolved to hex.
    static func sampleRings(_ v: [Double]) -> [Ring] {
        let colors = ["#FFD97A", "#F2B04A", "#D98324", "#A85A10"]
        let titles = ["Commit", "Learn", "Practice", "Reflect"]
        return v.enumerated().map { Ring(value: $1, color: colors[$0], title: titles[$0]) }
    }

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
        headline: "Notice One Bid", doneCount: 2, total: 4, day: nil,
        rings: sampleRings([1, 1, 0.34, 0])
    )

    // A light day — Commit and one practice of three. The case the ring exists
    // for: it should read as a real, partly filled mark, not as a miss.
    static let lightDay = DayPayload(
        label: "Today's Path", shortLabel: "Today", url: nil,
        steps: sampleSteps.map { Step(id: $0.id, title: $0.title, done: $0.id == "commit") },
        nextTitle: "Learn", nextDetail: "Love Languages",
        headline: "Love Languages", doneCount: 1, total: 4, day: nil,
        rings: sampleRings([1, 0, 0.34, 0])
    )

    // Nothing yet this morning: the ring's empty structure, as hairlines.
    static let untouched = DayPayload(
        label: "Today's Path", shortLabel: "Today", url: nil,
        steps: sampleSteps.map { Step(id: $0.id, title: $0.title, done: false) },
        nextTitle: "Commit", nextDetail: "Set today's intention",
        headline: "Set today's intention", doneCount: 0, total: 4, day: nil,
        rings: sampleRings([0, 0, 0, 0])
    )

    // Day closed — no count, warm close. Check this renders without a
    // trailing "4 of 4", which would turn a finish into a score.
    static let complete = DayPayload(
        label: "Today's Path", shortLabel: "Today", url: nil,
        steps: sampleSteps.map { Step(id: $0.id, title: $0.title, done: true) },
        nextTitle: nil, nextDetail: nil,
        headline: "Your day is complete.", doneCount: 4, total: 4, day: nil,
        rings: sampleRings([1, 1, 1, 1])
    )

    // An app that sends no rings — must look exactly as before.
    static let noRings = DayPayload(
        label: "Today's Path", shortLabel: "Today", url: nil,
        steps: sampleSteps,
        nextTitle: "Practice", nextDetail: "Notice One Bid",
        headline: "Notice One Bid", doneCount: 2, total: 4, day: nil
    )

    // A long practice title — the case that breaks layouts.
    static let longTitle = DayPayload(
        label: "Today's Path", shortLabel: "Today", url: nil,
        steps: sampleSteps,
        nextTitle: "Practice", nextDetail: "Say the hard thing without the edge",
        headline: "Say the hard thing without the edge",
        doneCount: 2, total: 4, day: nil,
        rings: sampleRings([1, 1, 0.34, 0])
    )
}

#Preview("Small", as: .systemSmall) {
    DayWidget()
} timeline: {
    DayEntry(date: .now, payload: .midday)
    DayEntry(date: .now, payload: .lightDay)
    DayEntry(date: .now, payload: .untouched)
    DayEntry(date: .now, payload: .complete)
    DayEntry(date: .now, payload: .noRings)
    DayEntry(date: .now, payload: .placeholder)
    DayEntry(date: .now, payload: .longTitle)
}

#Preview("Medium", as: .systemMedium) {
    DayWidget()
} timeline: {
    DayEntry(date: .now, payload: .midday)
    DayEntry(date: .now, payload: .lightDay)
    DayEntry(date: .now, payload: .complete)
    DayEntry(date: .now, payload: .noRings)
    DayEntry(date: .now, payload: .longTitle)
}

#Preview("Lock screen", as: .accessoryRectangular) {
    DayWidget()
} timeline: {
    DayEntry(date: .now, payload: .midday)
    DayEntry(date: .now, payload: .complete)
    DayEntry(date: .now, payload: .longTitle)
}

#Preview("Lock screen — circular", as: .accessoryCircular) {
    DayWidget()
} timeline: {
    DayEntry(date: .now, payload: .midday)
    DayEntry(date: .now, payload: .lightDay)
    DayEntry(date: .now, payload: .untouched)
    DayEntry(date: .now, payload: .noRings)
}
