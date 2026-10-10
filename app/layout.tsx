import type { Metadata } from "next";
import { JetBrains_Mono, Montserrat, Onest } from "next/font/google";
import { Shell } from "@/components/Shell";
import "./globals.css";

// cyrillic-ext carries the Kazakh letters (ә, ғ, қ, ң, ө, ұ, ү, һ, і).
const head = Montserrat({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-head",
});
const body = Onest({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-body",
});
const code = JetBrains_Mono({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-code",
});

// No title here: pages set document.title themselves in the visitor's language, and a
// title managed by Next would be written back over it. The static fallback is in <head>.
export const metadata: Metadata = {
  description: "Learn robotics by fixing what's broken.",
};

// Runs before first paint: applies the saved theme, text size and motion setting, and for a
// returning visitor keeps the page hidden until their saved language and progress are
// applied, so the default English page with zero progress never flashes by.
// The timeout is a safety net in case the app never starts.
const themeScript = `try{var r=localStorage.getItem("sheber:v1"),s=JSON.parse(r||"{}"),d=document.documentElement;if(s.theme==="light"||s.theme==="dark")d.dataset.theme=s.theme;if(s.textSize==="large")d.dataset.size="large";if(s.reduceMotion)d.dataset.motion="reduced";if(r){d.classList.add("pending");setTimeout(function(){d.classList.remove("pending")},1500)}}catch(e){}`;

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
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
