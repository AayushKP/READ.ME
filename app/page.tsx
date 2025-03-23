import { ModernHeroWithGradients } from "@/app/components/Hero";

export default function Home() {
  return (
    <div className="bg-white dark:bg-[#000000] gap-5 h-[100dvh] w-full flex flex-col justify-center items-center">
      <ModernHeroWithGradients />
    </div>
  );
}
