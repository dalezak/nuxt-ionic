import { useRouter } from '#imports';

/**
 * Navigates back one step in the browser history.
 * Use for "Back" buttons in non-Ionic-stack contexts.
 * For Ionic stack navigation prefer `showPage(path, false)` which uses
 * the ion-router and plays the correct back animation.
 * @example
 * <ion-button @click="hidePage()">Back</ion-button>
 */
export default function () {
  if (process.client) {
    const router = useRouter();
    router.go(-1);
  }
}