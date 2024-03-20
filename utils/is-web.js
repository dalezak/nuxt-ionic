import { isPlatform } from '@ionic/vue';
export default function () {
  return isPlatform('desktop') || isPlatform("mobileweb");
}