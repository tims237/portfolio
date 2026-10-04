export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Travaillons ensemble</h2>
      <p className="mt-4 text-slate-400">
        Je recherche une alternance en Data Analyst ou Data Engineering junior en Île-de-France.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a href="mailto:thymnoubissie@gmail.com" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition">
          M’écrire
        </a>
        <a href="https://www.linkedin.com/in/elvisnoubissie" target="_blank" className="px-6 py-3 rounded-lg border border-slate-600 hover:border-slate-400 transition">
          LinkedIn
        </a>
        <a href="https://github.com/TON-PSEUDO" target="_blank" className="px-6 py-3 rounded-lg border border-slate-600 hover:border-slate-400 transition">
          GitHub
        </a>
      </div>
    </section>
  )
}