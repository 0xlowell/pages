
import Hero from "./components/Hero";
// import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Capabilities from "./components/Capabilities";
// import Blog from "./components/Blog";
// import AppliedAIPresentation from "./components/AppliedAIPresentation";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Capabilities />
      <Projects />
      {/* <Blog /> */}
    </div>
  );
}
