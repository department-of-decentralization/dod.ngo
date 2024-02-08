import { Nav } from "../nav";
import { Foot } from "../foot";

export default function Events() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Nav></Nav>
      <div>Events</div>
      <Foot></Foot>
    </main>
  );
}
