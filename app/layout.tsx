import type { Metadata } from "next";
import { JetBrains_Mono, Montserrat, Onest } from "next/font/google";
import { CatalogProvider } from "@/components/Catalog";
import { Shell } from "@/components/Shell";
import { catalog } from "@/lib/catalog";
import "./globals.css";

// "subsets" lists what is downloaded up front, before the page needs it; every other subset
// is still available and is fetched the moment a page uses one of its letters. Fonts were
// half the weight of the first visit, so only the two text fonts are preloaded, and only in
// Latin and basic Cyrillic. The Kazakh letters (ә, ғ, қ, ң, ө, ұ, ү, һ, і) live in
// cyrillic-ext and arrive a moment later on Kazakh pages.
const head = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-head",
});
const body = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
});
// Numbers and code: not needed for the first paint, so not preloaded at all.
const code = JetBrains_Mono({
  preload: false,
  variable: "--font-code",
});

// No title here: pages set document.title themselves in the visitor's language, and a
// title managed by Next would be written back over it. The static fallback is in <head>.
export const metadata: Metadata = {
  description: "Learn robotics by fixing what's broken.",
};

// Runs before first paint: applies the saved theme, text size and motion setting. If the
// saved state would change what the page shows (another language, progress, a profile), the
// page stays hidden until that state is applied, so the default English page with zero
// progress never flashes by. A visitor with nothing of that kind saved sees the page at once.
// The timeout caps the wait: on a slow phone a brief flash beats a blank screen.
const themeScript = `try{var r=localStorage.getItem("sheber:v1"),s=JSON.parse(r||"{}"),d=document.documentElement,n=function(o){return o&&Object.keys(o).length};if(s.theme==="light"||s.theme==="dark")d.dataset.theme=s.theme;if(s.textSize==="large")d.dataset.size="large";if(s.reduceMotion)d.dataset.motion="reduced";if(s.lang&&s.lang!=="en"||n(s.attempts)||n(s.lessonsRead)||s.nickname||s.avatarColor&&s.avatarColor!=="orange"||s.avatarIcon&&s.avatarIcon!=="bolt"||s.primerOpen===false){d.classList.add("pending");setTimeout(function(){d.classList.remove("pending")},800)}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${head.variable} ${body.variable} ${code.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <title>Sheber</title>
        <script
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CatalogProvider catalog={catalog}>
          <Shell>{children}</Shell>
        </CatalogProvider>
      </body>
    </html>
  );
}
