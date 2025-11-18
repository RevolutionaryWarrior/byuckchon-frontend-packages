import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface Props {
  onAccepted?: () => void;
  onDismissed?: () => void;
}

export default function useInstallPWA({ onAccepted, onDismissed }: Props) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const clearPrompt = () => {
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const installPWA = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.error("설치 프롬프트를 사용할 수 없습니다.");
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        onAccepted?.();
      } else {
        onDismissed?.();
      }

      setDeferredPrompt(null);
      setIsInstallable(false);

      return outcome === "accepted";
    } catch (error) {
      console.error("PWA 설치 중 오류 발생:", error);
      return false;
    }
  };

  return { isInstallable, deferredPrompt, clearPrompt, installPWA };
}
