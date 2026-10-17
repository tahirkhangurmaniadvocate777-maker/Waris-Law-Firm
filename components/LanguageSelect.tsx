"use client";

import {
  DRAFT_LANGUAGE_OPTIONS,
  type DraftLanguage,
} from "@/lib/language";
import { Field, inputClass } from "@/lib/ui";

export function LanguageSelect({
  value,
  onChange,
  label = "Draft language / زبانِ مسودہ",
}: {
  value: DraftLanguage;
  onChange: (lang: DraftLanguage) => void;
  label?: string;
}) {
  return (
    <Field label={label} hint="Generated suit / application text follows this selection.">
      <select
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value as DraftLanguage)}
        dir="ltr"
      >
        {DRAFT_LANGUAGE_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
