import PageHeader from "@/components/PageHeader";
import SpinWheel from "@/components/SpinWheel";

export const metadata = { title: "Spin da Wheel" };

export default function SpinDaWheelPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <PageHeader
        eyebrow="Tools"
        title="Spin da Wheel"
        description="Set the number of options, their names and colors, then spin for a random result. Useful for oral assessments, cold calling, or any random picker."
      />
      <SpinWheel />
    </div>
  );
}
