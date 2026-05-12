"use client";

import { Button } from "@/components/ui/button";

export default function PrintButton() {
  return (
    <Button type="button" onClick={() => window.print()}>
      Imprimir / Salvar PDF
    </Button>
  );
}
