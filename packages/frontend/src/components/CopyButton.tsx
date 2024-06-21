"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

export default function ({ valueToCopy, name, disabled }: { valueToCopy: string; name: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    setCopied(true);
    await navigator.clipboard.writeText(valueToCopy);
    setTimeout(() => setCopied(false), 1000);
  };
  return (
    <Button
      onClick={copyToClipboard}
      endIcon={<Icon icon={{ prefix: "fas", iconName: copied ? "check" : "copy" }} />}
      disabled={disabled}
    >
      {copied ? `Copied ${name}` : `Copy ${name}`}
    </Button>
  );
}
