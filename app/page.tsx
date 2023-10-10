import FireCanvas from "@/app/components/FireCanvas/FireCanvas";

const WIDTH = 320;
const HEIGHT = 240;

export default function Home() {
  return (
    <main>
      <h1>Demoscene Fire Effect</h1>
      <FireCanvas width={WIDTH} height={HEIGHT} />
    </main>
  );
}
