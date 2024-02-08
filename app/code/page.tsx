import { Nav } from "../nav";
import { Foot } from "../foot";

export default function Code() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Nav></Nav>
      <div>Code of Conduct</div>
      <Foot></Foot>
    </main>
  );
}
