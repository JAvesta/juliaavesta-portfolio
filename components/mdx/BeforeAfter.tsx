import fs from "node:fs";
import path from "node:path";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { Figure } from "./Figure";

type Props = React.ComponentProps<typeof BeforeAfterSlider>;
const has = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));

/** Server wrapper used as <BeforeAfterSlider> in MDX: renders the interactive slider once both
 *  files exist in /public, and two labelled placeholders (same alt text) until then. */
export function BeforeAfter(props: Props) {
  if (has(props.before) && has(props.after)) return <BeforeAfterSlider {...props} />;
  return (
    <figure className="my-8">
      <div className={`grid items-start gap-4 ${props.aspect === "9/16" ? "grid-cols-[repeat(auto-fill,minmax(160px,240px))]" : "grid-cols-1 sm:grid-cols-2"}`}>
        <Figure src={props.before} alt={props.beforeAlt ?? "Before"} caption="Before" aspect={props.aspect ?? "4/3"} />
        <Figure src={props.after} alt={props.afterAlt ?? "After"} caption="After" aspect={props.aspect ?? "4/3"} />
      </div>
      {props.caption && <figcaption className="mt-2 text-[14.5px] text-muted">Becomes a drag-to-compare slider once both images are added.</figcaption>}
    </figure>
  );
}
