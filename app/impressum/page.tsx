import { Nav } from "../nav";
import { Foot } from "../foot";

export default function Impressum() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Nav></Nav>
      <div>Impressum</div>
      <Foot></Foot>
    </main>
  );
}
