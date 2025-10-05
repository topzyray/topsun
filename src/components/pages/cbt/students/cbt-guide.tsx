"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { STORE_KEYS } from "@/configs/store.config";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { Student } from "../../../../../types";
import { Badge } from "@/components/ui/badge";

const INSTRUCTIONS: Record<string, string[]> = {
  english: [
    "Read each question carefully before selecting your answer.",
    "You must attempt all questions. Skipping questions may affect your final score.",
    "Use the 'Next' and 'Previous' buttons to navigate between questions.",
    "Ensure you select an answer before proceeding to the next question.",
    "You can change your answer at any time before submitting the exam.",
    "Your progress is saved automatically as you navigate through the exam.",
    "Do not refresh or close the browser tab while the exam is in progress.",
    "If your session ends unexpectedly, try to log in again to continue the test.",
    "The exam has a time limit. Keep an eye on the timer at the top of the screen.",
    "Once the time is up, your exam will be submitted automatically.",
    "Click the 'Submit Exam' button only when you are sure you have completed all questions.",
    "Unanswered questions will be highlighted before final submission.",
    "Seek clarification from the exam supervisor if you encounter technical issues.",
  ],
  yoruba: [
    "Ka ibeere kọọ́kan dáadáa kí o tó yan ìdáhùn rẹ.",
    "O gbọdọ gbìmọ̀ gbogbo ìbéèrè. Àfiwọ̀ àwọn ìbéèrè le fa yíyọ̀ àpọ̀ arábìnrin rẹ̀.",
    "Lo bọtìnì 'Next' àti 'Previous' láti lọ sórí ìbéèrè.",
    "Rí i dájú pé o ti yan ìdáhùn ṣáájú kí o tó lọ si ìbéèrè tó ń bọ́.",
    "O lè yí ìdáhùn rẹ padà nígbàkugba ṣáájú fífi idanwo náà ránṣẹ́.",
    "A ti fipamọ́ ìlọsíwaju rẹ̀ laifọwọyi bi o ṣe ń ṣiṣe ínà.",
    "Má ṣe tún ojú-ìwé àwòrán ṣètò tàbí pa taabu aṣàwákiri nígbà tí idanwo ń lọ.",
    "Tí ìpẹ̀yà rẹ̀ bá parí láì rí àtúnjúwe, gbìyànjú láti wọlé padà kí o tesiwaju.",
    "Idanwo ní ìpinnu àkókò kan. Mọ́ àkókò to kù ní orí àpapọ̀ ojú-íbòyà.",
    "Lọ́ọ́tẹ́ tí àkókò bá parí, idanwo rẹ̀ yóò ránṣẹ́ ní laifọwọyi.",
    "Tẹ́ bọtìnì 'Submit Exam' nígbà tí o bá jẹ́ pé o ti parí gbogbo ìbéèrè.",
    "Ìbéèrè tí a kò dáhùn yóò jẹ́ àfihàn kí o tó fi ikẹhin ránṣẹ́.",
    "Bá a bá ní ìṣàkóso imọ́-ṣàrọ̀ yèwu, kan si olùṣọ́ ìdánwò.",
  ],
  hausa: [
    "Gụọ ajụjụ ọ bụla nke ọma tupu ị họrọ azịza gị.",
    "Ị ga-azaghachi ajụjụ niile. Ighaghachi ajụjụ nwere ike imetụta akara gị.",
    "Jiri bọtịnụ 'Next' na 'Previous' emegharị n'etiti ajụjụ.",
    "Jide n'aka na ị họrọla azịza tupu ị gara n’ajụjụ ọzọ.",
    "Ị nwere ike gbanwee azịza gị mgbe ọ bụla tupu izitere nyocha.",
    "A na-edobe ọdịnihu gị akpaghị aka ka ị na-eme nchọpụta.",
    "Ejila imegharị ibe weebụ ma ọ bụ mechie taabụ nchọgharị n'oge nyocha.",
    "Ọ bụrụ na oge gị kwụsịrị n’ụzọ na-atụghị anya ya, gbalịa banye ọzọ.",
    "Nchọpụta nwere oke oge. Lelee ma elekere n’elu ihuenyo.",
    "Ozugbo oge gwụsịrị, a ga-ebugharị nyocha gị n’onwe ya.",
    "Pịa bọtịnụ 'Submit Exam' mgbe ị jụrụ ajụjụ niile.",
    "Ajụjụ ndị na-adịghị azaghachiri ga-acha anụnụ anụnụ tupu izitere nchigharị ikpeazụ.",
    "Chọọ ndụmọdụ n'aka onye nlekọta ma ọ bụrụ na ịnọ na nsogbu teknụzụ.",
  ],
  igbo: [
    "Gụọ ajụjụ ọ bụla nke ọma tupu ị họrọ azịza gị.",
    "Ị ga-azaghachi ajụjụ niile. Ighaghachi ajụjụ nwere ike imetụta akara gị.",
    "Jiri bọtịnụ 'Next' na 'Previous' emegharị n'etiti ajụjụ.",
    "Jide n'aka na ị họrọla azịza tupu ị gara n’ajụjụ ọzọ.",
    "Ị nwere ike gbanwee azịza gị mgbe ọ bụla tupu izitere nyocha.",
    "A na-edobe ọdịnihu gị akpaghị aka ka ị na-eme nchọpụta.",
    "Ejila imegharị ibe weebụ ma ọ bụ mechie taabụ nchọgharị n'oge nyocha.",
    "Ọ bụrụ na oge gị kwụsịrị n’ụzọ na-atụghị anya ya, gbalịa banye ọzọ.",
    "Nchọpụta nwere oke oge. Lelee ma elekere n’elu ihuenyo.",
    "Ozugbo oge gwụsịrị, a ga-ebugharị nyocha gị n’onwe ya.",
    "Pịa bọtịnụ 'Submit Exam' mgbe ị jụrụ ajụjụ niile.",
    "Ajụjụ ndị na-adịghị azaghachiri ga-acha anụnụ anụnụ tupu izitere nchigharị ikpeazụ.",
    "Chọọ ndụmọdụ n'aka onye nlekọta ma ọ bụrụ na ịnọ na nsogbu teknụzụ.",
  ],
  pidgin: [
    "Read each question well before you select your answer.",
    "You suppose answer all di questions. If you skip any, e fit affect your score.",
    "Use the 'Next' and 'Previous' buttons to waka between questions.",
    "Make sure say you pick answer before you move to next question.",
    "You fit change your answer anytime before you submit exam.",
    "Your progress dey save automatically as you dey waka through exam.",
    "No refresh or close the browser tab while exam dey go on.",
    "If session end anyhow, try to log in again to continue di test.",
    "This exam get time limit. Watch the timer for top of screen.",
    "Once time finish, exam go submit by itself.",
    "Click 'Submit Exam' once you sure say you don complete all questions.",
    "Unanswered questions go show before final submission.",
    "If wahala tech come, make you consult exam supervisor.",
  ],
  swahili: [
    "Soma kila swali kwa makini kabla ya kuchagua jibu lako.",
    "Ni lazima ujibu maswali yote. Kuruka maswali kunaweza kuathiri alama yako.",
    "Tumia vitufe 'Next' na 'Previous' kusogea kati ya maswali.",
    "Hakikisha umechagua jibu kabla ya kusonga kwenye swali linalofuata.",
    "Unaweza kubadilisha jibu lako wakati wowote kabla ya kuwasilisha mtihani.",
    "Maendeleo yako yanaohifadhiwa kiotomatiki unaposogeza kupitia mtihani.",
    "Usifanye upya au kufunga kichupo cha kivinjari wakati mtihani unapoendelea.",
    "Iwapo kikao chako kimemalizika bila kutarajia, jaribu kuingia tena.",
    "Mtihani una kikomo cha muda. Tazama kipima muda juu ya skrini.",
    "Mara muda utakapokamilika, mtihani utawasilishwa kiotomatiki.",
    "Bonyeza 'Submit Exam' tu unaposikia umekamilisha maswali yote.",
    "Maswali yasiyo na majibu yataonyeshwa kabla ya uwasilishaji wa mwisho.",
    "Tafuta ufafanuzi kutoka kwa msimamizi wa mtihani ikikujia tatizo la kiufundi.",
  ],
  twi: [
    "Kenkan bisa biara yie ansa na woayi wo mmuae.",
    "Wosɛe sɛ wobɛyi bisa nyinaa. Sɛ wofa mu bi a, ɛtumi ka wo mpaw.",
    "Fa 'Next' ne 'Previous' button no kɔ bisa no ntam.",
    "Hwɛ yiye sɛ wopaw mmuae ansa na wokɔ bisa a ɛdi hɔ.",
    "Wubetumi sesa wo mmuae bere biara ansa na woatwerɛ exam no.",
    "Wo nkɔso deɛ, ɛbɔ hɔ akyirikyiri bere a worekɔ so.",
    "Mma wo mfa browser tab no mfi so anaa nka no bio bere a exam no reyɛ.",
    "Sɛ wo session gyina hɔ a, san kɔ login bio na to so.",
    "Exam no wɔ bere a wɔahyehyɛ ma no. Hwɛ timer no wɔ ekran so.",
    "Bere a bere no awie a, wɔbɛtwe exam no atomati.",
    "Paw 'Submit Exam' bere a wobɛyɛ hu sɛ woanyina bisa no nyinaa.",
    "Bisa a woannya mmuae wɔn bɛda hɔ ansa na wɔtow ato dwumadie no awieɛ.",
    "Sɛ wowɔ ɔhaw bi a, bisa exam supervisionfoɔ no ho mmoa.",
  ],
  french: [
    "Lisez chaque question attentivement avant de sélectionner votre réponse.",
    "Vous devez répondre à toutes les questions. Sauter des questions peut affecter votre note finale.",
    "Utilisez les boutons 'Next' et 'Previous' pour naviguer entre les questions.",
    "Assurez-vous de sélectionner une réponse avant de passer à la question suivante.",
    "Vous pouvez modifier votre réponse à tout moment avant de soumettre l’examen.",
    "Vos progrès sont enregistrés automatiquement au fur et à mesure.",
    "Ne rafraîchissez pas et ne fermez pas l’onglet du navigateur pendant l’examen.",
    "Si votre session se termine de façon inattendue, essayez de vous reconnecter pour continuer.",
    "Le temps de l’examen est limité. Surveillez le chronomètre en haut de l’écran.",
    "Une fois le temps écoulé, votre examen sera soumis automatiquement.",
    "Cliquez sur le bouton 'Submit Exam' uniquement lorsque vous êtes sûr d’avoir répondu à toutes les questions.",
    "Les questions sans réponse seront mises en surbrillance avant la soumission finale.",
    "Demandez des éclaircissements au superviseur de l’examen en cas de problèmes techniques.",
  ],
};

export default function CBTGuide() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof INSTRUCTIONS>(() => {
    const stored = StorageUtilsHelper.getItemsFromLocalStorage([STORE_KEYS.LANGUAGE_STORAGE_KEY]);
    return (stored[STORE_KEYS.LANGUAGE_STORAGE_KEY] as string) || "english";
  });

  const { userDetails } = useAuth();
  const student = (userDetails as Student) ?? {};

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    StorageUtilsHelper.saveToLocalStorage([STORE_KEYS.LANGUAGE_STORAGE_KEY, lang]);
  };

  const speakInstructions = () => {
    const utterance = new SpeechSynthesisUtterance(INSTRUCTIONS[selectedLanguage].join(". "));
    utterance.lang =
      selectedLanguage === "french"
        ? "fr-FR"
        : selectedLanguage === "swahili"
          ? "sw"
          : selectedLanguage === "yoruba"
            ? "yo"
            : selectedLanguage === "hausa"
              ? "ha"
              : selectedLanguage === "igbo"
                ? "ig"
                : selectedLanguage === "twi"
                  ? "ak" // Twi/Asante (Akan) fallback
                  : selectedLanguage === "pidgin"
                    ? "en-NG"
                    : "en-US";

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  const handleProceed = () => {
    if (accepted) {
      router.push("timetable");
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="mt-5 w-full max-w-4xl py-12 shadow-md lg:mt-10 lg:py-18">
        <CardContent className="p-4">
          <div className="space-y-6 lg:px-10">
            <h1 className="text-center text-2xl font-bold uppercase lg:text-4xl">
              🧾General CBT Instructions
            </h1>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-end gap-2">
                <Select value={selectedLanguage} onValueChange={(val) => handleLanguageChange(val)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="yoruba">Yoruba</SelectItem>
                    <SelectItem value="hausa">Hausa</SelectItem>
                    <SelectItem value="igbo">Igbo</SelectItem>
                    <SelectItem value="pidgin">Pidgin</SelectItem>
                    <SelectItem value="swahili">Swahili</SelectItem>
                    <SelectItem value="twi">Asante (Twi)</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={speakInstructions}>
                  🔊
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <Badge
                  variant="outline"
                  onClick={() => {
                    if (window.speechSynthesis.paused) {
                      window.speechSynthesis.resume();
                    } else {
                      const text = INSTRUCTIONS[selectedLanguage].join(". ");
                      const utterance = new SpeechSynthesisUtterance(text);
                      utterance.lang =
                        selectedLanguage === "french"
                          ? "fr-FR"
                          : selectedLanguage === "swahili"
                            ? "sw"
                            : selectedLanguage === "yoruba"
                              ? "yo"
                              : selectedLanguage === "hausa"
                                ? "ha"
                                : selectedLanguage === "igbo"
                                  ? "ig"
                                  : selectedLanguage === "twi"
                                    ? "ak"
                                    : selectedLanguage === "pidgin"
                                      ? "en-NG"
                                      : "en-US";
                      window.speechSynthesis.cancel();
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                >
                  🔊 Play Again
                </Badge>

                <Badge variant="outline" onClick={() => window.speechSynthesis.pause()}>
                  ⏸ Pause
                </Badge>

                <Badge variant="outline" onClick={() => window.speechSynthesis.resume()}>
                  ▶️ Resume
                </Badge>

                <Badge variant="outline" onClick={() => window.speechSynthesis.cancel()}>
                  ⏹ Stop
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="h-full max-h-[15rem] space-y-4 overflow-auto">
              <ul className="list-inside list-disc space-y-4 text-sm sm:text-base">
                {INSTRUCTIONS[selectedLanguage].map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ul>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="agree"
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(Boolean(checked))}
                />
                <Label htmlFor="agree" className="text-sm sm:text-base">
                  I have read and agree to the instructions above.
                </Label>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between pt-4">
              <Button onClick={() => router.back()}>Back</Button>
              <Button
                disabled={!accepted || !student?.current_class?.class_id?._id}
                onClick={handleProceed}
              >
                Proceed to Exam Timetable
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
