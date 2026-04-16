import React from 'react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-5">{title}</h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="font-serif text-lg font-semibold text-slate-800 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-600 leading-relaxed mb-4">{children}</p>;
}

function Divider() {
  return <div className="border-t border-slate-200 my-12" />;
}

export default function About() {
  return (
    <div className="h-full overflow-y-auto bg-[#FDFBF7]">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-medium tracking-widest text-emerald-600 uppercase mb-3">
            About
          </p>
          <h1 className="font-serif text-4xl font-bold text-slate-900 leading-tight mb-5">
            Beautiful <span className="italic text-emerald-600">BibleData</span>
          </h1>
          <P>
            <strong className="text-slate-800">Beautiful Bible Data</strong> is an interactive
            visualization of over <strong className="text-slate-800">340,000 cross-references</strong>{' '}
            spanning the entire Bible — from Genesis to Revelation. Every arc you see on the screen
            represents a connection between two passages of Scripture, drawn from one of the most
            comprehensive cross-reference datasets ever compiled.
          </P>
          <P>
            This project is a love letter to the data, to the tradition of biblical scholarship,
            and to the generation of designers and researchers who have visualized these connections
            before me.
          </P>
        </div>

        <Divider />

        {/* What Is It */}
        <Section title="What Is Beautiful Bible Data?">
          <P>
            At its core, Beautiful Bible Data is a tool for{' '}
            <strong className="text-slate-800">exploring the interconnectedness of Scripture</strong>.
            The Bible is not a flat, linear text — it is a vast network of echoes, quotations,
            prophecies, fulfillments, and thematic parallels. Modern study Bibles capture a handful
            of these connections in their footnotes. This visualization lets you see{' '}
            <strong className="text-slate-800">all of them at once</strong>.
          </P>

          <p className="text-slate-700 font-medium mb-3">What you can do here</p>
          <ul className="space-y-2 mb-4">
            {[
              'Zoom in and out across the entire biblical canon to move between the forest and the trees',
              'Click any arc to open the two connected passages side by side',
              'Use the built-in reader to walk through every cross-reference for a given verse',
              'Search by chapter and instantly isolate every arc flowing in and out of it',
              'Filter by scope — Old Testament only, New Testament only, OT ↔ NT connections, or Messianic prophecies',
              'Filter by connection strength — surface only the strongest, most frequently cited links, or lower the threshold to reveal the full density of Scripture\'s internal web',
              'Explore 340,000+ references — the on-screen preview renders up to 5,000 arcs at a time for performance, while the complete dataset remains accessible through the reader, search, and filters',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Divider />

        {/* Strength Filtering */}
        <Section title="Why Strength Filtering Matters">
          <P>
            Not all cross-references carry equal weight. A single thematic link between two verses
            might reflect a shared word or image; a pair of passages connected by ten or more
            independent references is almost certainly saying something that Christian tradition
            considered central.
          </P>
          <P>
            The strength filter is one of the most powerful features of Beautiful Bible Data
            because it lets you shift your view at will:
          </P>
          <ul className="space-y-3 mb-4">
            <li className="flex gap-3 text-slate-600 leading-relaxed">
              <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-slate-800">Set a high threshold</strong> to see the{' '}
                <strong className="text-slate-800">spine of Scripture</strong> — the most densely
                interlinked passages, the verses that the tradition has returned to again and again.
              </span>
            </li>
            <li className="flex gap-3 text-slate-600 leading-relaxed">
              <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-slate-800">Lower the threshold</strong> to reveal the{' '}
                <strong className="text-slate-800">full tapestry</strong> of thematic threads
                running through the Bible, including subtle connections a casual reader would
                never notice.
              </span>
            </li>
          </ul>
          <P>
            This is what interactive visualization makes possible that a static image cannot: the
            ability to ask different questions of the same data depending on what you're looking for.
          </P>
        </Section>

        <Divider />

        {/* Shoulders of Giants */}
        <Section title="Standing on the Shoulders of Giants">
          <P>
            This project did not appear out of nowhere. It is part of a lineage of data-driven
            biblical scholarship and information design stretching back nearly two decades. Proper
            credit matters, so here it is.
          </P>

          <SubSection title="Chris Harrison and Christoph Römhild (2007)">
            <P>
              The original, iconic arc visualization of Bible cross-references was created by{' '}
              <a
                href="http://www.chrisharrison.net/index.php/Visualizations/BibleViz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-600 transition-colors"
              >
                Chris Harrison
              </a>{' '}
              in collaboration with Lutheran pastor <strong className="text-slate-800">Christoph Römhild</strong>{' '}
              in 2007. Their piece mapped 63,000 cross-references as colored arcs arranged above a
              horizontal bar representing the books and chapters of the Bible.
            </P>
            <P>
              In Harrison's own words, they aimed to create{' '}
              <em>
                "something more beautiful than functional. At the same time, we wanted something
                that honored and revealed the complexity of the data at every level — as one leans
                in, smaller details should become visible."
              </em>
            </P>
            <P>
              They succeeded so well that their image has become a touchstone of modern data
              visualization, inspiring countless remakes, academic papers, and art projects. It is,
              without exaggeration, one of the defining visualizations of the 21st century. This
              project exists because that image exists.
            </P>
          </SubSection>

          <SubSection title="OpenBible.info">
            <P>
              The cross-reference dataset powering Beautiful Bible Data comes from{' '}
              <a
                href="https://www.openbible.info/labs/cross-references/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-600 transition-colors"
              >
                OpenBible.info
              </a>
              , who compiled and released it as an open resource for the community. Their work made
              this project possible — the full 340,000-reference dataset is freely available thanks
              to their stewardship of the data.
            </P>
            <P>
              OpenBible.info has also published several outstanding visualizations of their own
              using this dataset, and they continue to be one of the most valuable resources on the
              web for anyone working at the intersection of Scripture and data.
            </P>
          </SubSection>

          <SubSection title="Robert Rouse">
            <P>
              <a
                href="https://viz.bible/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-600 transition-colors"
              >
                Robert Rouse
              </a>{' '}
              built an influential interactive remake of Harrison's visualization in Tableau,
              analyzing the full 340,000-reference dataset from OpenBible.info. His remake —{' '}
              <a
                href="https://public.tableau.com/views/BibleCrossReferences/Arcs?:embed=y&:loadOrderID=0&:display_count=y&:showTabs=y&:origin=viz_share_link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-600 transition-colors"
              >
                available on Tableau Public
              </a>{' '}
              — introduced clickable chapter highlighting and tooltips, giving users the ability not
              just to admire the connections, but to investigate them.
            </P>
            <P>
              Equally important, Rouse's{' '}
              <a
                href="https://viz.bible/remaking-an-influential-cross-reference-visualization/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-600 transition-colors"
              >
                writing on what the dataset reveals
              </a>{' '}
              — and what it <em>doesn't</em> reveal — was a direct inspiration for this project. His
              observation that the book of Revelation shows surprisingly few links to Old Testament
              prophetic books, despite being saturated with Old Testament symbolism, is the kind of
              insight that only becomes visible when you interact with the data rather than just
              look at it. His work made clear that Torrey's 19th-century index was built around{' '}
              <strong className="text-slate-800">topical</strong> connections rather than direct
              quotations or allusions — a crucial piece of context for anyone using this dataset to
              study Scripture.
            </P>
            <P>
              His broader project,{' '}
              <a
                href="https://viz.bible/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-600 transition-colors"
              >
                Viz.Bible
              </a>
              , continues to be an outstanding resource for anyone interested in the intersection of
              Scripture and data visualization.
            </P>
          </SubSection>

          <SubSection title="Similar Diversity and Others">
            <P>
              The <strong className="text-slate-800">Similar Diversity</strong> project extended
              the arc visualization concept to the holy texts of five major world religions, opening
              up comparative questions that a single-tradition visualization cannot answer. Many
              other designers, developers, and scholars have remade, remixed, and extended the arc
              visualization over the years, each bringing their own perspective to the data.
              Beautiful Bible Data is one more contribution to that ongoing conversation.
            </P>
          </SubSection>
        </Section>

        <Divider />

        {/* About the Data */}
        <Section title="About the Data: R.A. Torrey's Treasury of Scripture Knowledge">
          <P>
            The cross-references displayed here trace back to{' '}
            <strong className="text-slate-800">
              R.A. Torrey's <em>Treasury of Scripture Knowledge</em>
            </strong>
            , a 19th-century index compiled to help readers of the Bible follow thematic and
            theological threads across the entire canon.
          </P>
          <P>
            One crucial thing to understand about Torrey's index — and therefore about this
            visualization — is that it was built primarily on{' '}
            <strong className="text-slate-800">topical and thematic connections</strong>, not on
            direct quotations or verbal allusions. This has fascinating consequences that only
            become visible when you explore the data:
          </P>
          <ul className="space-y-3 mb-4">
            {[
              'Genesis and Psalms show connections spanning the entire Bible because they touch on nearly every theological theme.',
              'Revelation, despite being saturated with Old Testament symbolism, shows relatively few links to the prophetic books — because Torrey indexed by subject, and Revelation\'s subject matter is narrowly apocalyptic.',
              'The Gospels show fewer links to Messianic prophecies than a modern study Bible would suggest, for the same reason.',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
          <P>
            The dataset averages nearly{' '}
            <strong className="text-slate-800">11 cross-references per verse</strong> across the
            entire Bible. Some of those are the kinds of direct quotations a modern reader would
            expect. Many more are thematic echoes a reader might never notice on their own.
          </P>
          <P>
            Visualizing the data like this doesn't just show us what we already know — it shows us{' '}
            <strong className="text-slate-800">what is actually there in the index</strong>,
            including patterns that challenge our assumptions about how Scripture is connected. That,
            to me, is the whole point of data visualization: showing what's there, not just what we
            expect.
          </P>
        </Section>

        <Divider />

        {/* Why I Built This */}
        <Section title="Why I Built This">
          <P>
            When I encountered Chris Harrison and Christoph Römhild's original arc visualization, I
            felt what many people feel when they first see it: a kind of awe at the complexity and
            coherence of Scripture made visible. I stared at it, thought about it, and eventually
            started asking the question that every data visualization eventually provokes —{' '}
            <em>what if I could interact with this?</em>
          </P>
          <P>
            What if I could click a chapter and see exactly what connects to it? What if I could
            filter the noise and see only the strongest links? What if I could read both sides of a
            connection without leaving the page?
          </P>
          <P>
            Beautiful Bible Data is my attempt to answer those questions. It is fully interactive,
            zoomable, searchable, and filterable. It includes a built-in reader so you can actually{' '}
            <strong className="text-slate-800">read</strong> the connections rather than just admire
            them. And it is freely available to anyone who wants to explore Scripture as a network
            rather than a sequence.
          </P>
        </Section>

        <Divider />

        {/* Get Involved */}
        <Section title="Get Involved">
          <P>
            <strong className="text-slate-800">Beautiful Bible Data</strong> is live at{' '}
            <a
              href="https://beautifulbibledata.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-600 transition-colors"
            >
              beautifulbibledata.com
            </a>
            . No installation, no sign-up — just open it in your browser and start exploring.
          </P>
          <P>
            If you find a bug, have a feature idea, want to collaborate, or simply want to share
            what you've discovered, I'd love to hear from you.
          </P>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.linkedin.com/in/daniel-llll/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a
              href="mailto:daniel@lizardo.co"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              daniel@lizardo.co
            </a>
          </div>
        </Section>

        <Divider />

        {/* Acknowledgments */}
        <Section title="Acknowledgments">
          <p className="text-slate-600 leading-relaxed mb-3">Deepest thanks to:</p>
          <ul className="space-y-2 mb-6">
            {[
              'Chris Harrison and Christoph Römhild for creating the original visualization that started it all',
              'OpenBible.info for stewarding and sharing the cross-reference dataset openly',
              'Robert Rouse for his interactive Tableau remake and his thoughtful writing on what the data reveals',
              'R.A. Torrey, whose 19th-century labor of love continues to connect readers to Scripture more than a century after its publication',
              'The broader community of data visualization practitioners, biblical scholars, and curious readers whose work makes projects like this possible',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* Footer note */}
        <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-200 pt-8 italic">
          Beautiful Bible Data is an independent project. It is not affiliated with any church,
          denomination, or publisher. The cross-reference dataset is provided by{' '}
          <a
            href="https://www.openbible.info/labs/cross-references/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-slate-300 hover:text-slate-600 transition-colors"
          >
            OpenBible.info
          </a>{' '}
          under their own terms; please refer to their site for licensing details if you wish to
          reuse the data.
        </p>

      </div>
    </div>
  );
}
