import { isPlatform } from '@ionic/vue';
export default function () {
  return isPlatform('mobile') || isPlatform('ios') || isPlatform('android');
}