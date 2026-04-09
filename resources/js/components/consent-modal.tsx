import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type ConsentModalProps = {
  open: boolean;
  onAgree: () => void;
};

type Language = "en" | "tl" | "bs";

// Polished, non-redundant consent texts
const consentTexts: Record<Language, string> = {
  en: `
<p>The EDALAW+ system fully complies with the Data Privacy Act of 2012, ensuring your privacy and confidentiality. During online registration, we will collect your name, email address, contact information, and other personal details in accordance with the law. This data will be retained only as long as necessary for its intended purpose.</p><br>

<p>We are committed to protecting your personal information within the EDALAW+ system. Any information you provide will be treated confidentially and securely, accessible only to authorized personnel. Information that is no longer needed will be properly disposed of to prevent unauthorized access or disclosure.</p><br>

<p>Thank you.</p>
`,
  tl: `
<p>Ang EDALAW+ system ay ganap na sumusunod sa Data Privacy Act of 2012, na tinitiyak ang iyong karapatan sa privacy at pagiging kumpidensyal. Sa proseso ng online na pagpaparehistro, kokolektahin namin ang iyong pangalan, email address, impormasyon sa pakikipag-ugnayan, at iba pang personal na detalye alinsunod sa batas. Ang mga datos ay itatago lamang hangga't kinakailangan para sa nakalaang layunin.</p><br>

<p>Pinangangalagaan namin ang iyong personal na impormasyon sa EDALAW+ system. Ligtas at kumpidensyal ang lahat ng impormasyong ibibigay mo at maa-access lamang ng mga awtorisadong tauhan. Ang anumang impormasyon na hindi na kailangan ay maayos na itatapon upang maiwasan ang hindi awtorisadong pag-access o pagbubunyag.</p><br>

<p>Maraming salamat.</p>
`,
  bs: `
<p>Ang EDALAW+ system hingpit nga nagsunod sa Data Privacy Act of 2012, nga nagsiguro sa imong katungod sa pribasiya ug kumpidensyalidad. Sa online nga pagrehistro, kolektahon namo ang imong ngalan, email address, impormasyon sa pagkontak, ug uban pang personal nga detalye sumala sa balaod. Kini nga datos tipigan lang kutob sa gikinahanglan alang sa gituyoan niini.</p><br>

<p>Gipanag-iya namo ang imong personal nga impormasyon sa EDALAW+ system. Ang tanan nga impormasyon nga imong ihatag luwas ug kumpidensyal, ug ma-access lamang sa awtorisadong personnel. Ang impormasyon nga dili na kinahanglan pagataptan sa husto aron malikayan ang dili awtorisadong paggamit o pagpagawas.</p><br>

<p>Daghang salamat.</p>
`,
};

// Checkbox text handles consent to avoid redundancy
const checkboxTexts: Record<Language, string> = {
  en: "I have read and understood the statements above and I voluntarily give my consent.",
  tl: "Nabasa at naunawaan ko ang mga pahayag sa itaas at boluntaryo kong ibinibigay ang aking pahintulot.",
  bs: "Nabasa ug nasabtan nako ang mga pahayag sa ibabaw ug boluntaryo nako gihatag ang akong pagtugot.",
};

export default function ConsentModal({ open, onAgree }: ConsentModalProps) {
  const [checked, setChecked] = useState(false);
  const [language, setLanguage] = useState<Language>("en");

  return (
    <Dialog open={open} onOpenChange={() => { }}>
      {/* Fully responsive wide modal with vertical scroll */}
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Data Privacy and Consent</DialogTitle>
        </DialogHeader>

        {/* LANGUAGE TOGGLE (UNDERLINE LINKS) */}
        <p className="text-sm mb-2 space-x-4">
          <span
            onClick={() => setLanguage("en")}
            className={`cursor-pointer ${language === "en" ? "underline" : ""}`}
          >
            English
          </span>
          <span>|</span>
          <span
            onClick={() => setLanguage("tl")}
            className={`cursor-pointer ${language === "tl" ? "underline" : ""}`}
          >
            Tagalog
          </span>
          <span>|</span>
          <span
            onClick={() => setLanguage("bs")}
            className={`cursor-pointer ${language === "bs" ? "underline" : ""}`}
          >
            Bisaya
          </span>
        </p>

        {/* CONSENT TEXT */}
        <div className="space-y-4 text-sm leading-relaxed text-justify">
          <div dangerouslySetInnerHTML={{ __html: consentTexts[language] }} />

          {/* CHECKBOX */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="consent"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="consent" className="text-sm">
              {checkboxTexts[language]}
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button disabled={!checked} onClick={onAgree}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}