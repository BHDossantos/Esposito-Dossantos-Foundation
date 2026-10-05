import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Section } from '@/components/Section';
import Reveal from '@/components/Reveal';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'about');
}

const founders = [
  {
    initial: 'B',
    name: 'Bruno dos Santos',
    role: 'Co-founder',
    bio: 'Brings a background in technology, education, and leadership — and a saxophone that keeps music close to everything he builds.'
  },
  {
    initial: 'C',
    name: 'Caíque Esposito',
    role: 'Co-founder',
    bio: 'Brings deep musical experience and a commitment to helping young people discover what they can express through an instrument.'
  },
  {
    initial: 'G',
    name: 'Guilia Esposito',
    role: 'Administration Director',
    bio: 'Shaped the founding program, Arte que Transforma, and holds close the community it is built to serve.'
  }
];

// A warm serif pull-quote used to let the story breathe.
function PullQuote({ children }: { children: ReactNode }) {
  return (
    <Reveal as="div" className="my-12">
      <blockquote className="mx-auto max-w-2xl border-l-2 border-champagne pl-6 font-serif text-2xl leading-snug text-navy sm:text-3xl">
        {children}
      </blockquote>
    </Reveal>
  );
}

function Para({ children, lead = false }: { children: ReactNode; lead?: boolean }) {
  return (
    <p className={`mt-5 leading-relaxed ${lead ? 'text-xl text-ink' : 'text-lg text-ink/80'}`}>
      {children}
    </p>
  );
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* ───────────────── Hero ───────────────── */}
      <section className="relative overflow-hidden bg-navy-900 pt-36 pb-24 sm:pt-44 sm:pb-28">
        <div className="absolute inset-0">
          <div className="absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-champagne/10 blur-[140px]" />
          <div className="absolute right-0 bottom-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_bottom_right,rgba(21,53,95,0.6),transparent_60%)]" />
        </div>
        <div className="container-px relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-champagne-light">Our Story</p>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.1] text-ivory sm:text-5xl lg:text-6xl">
              A friendship in Italy.
              <br className="hidden sm:block" /> Two dreams. One shared purpose.
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ivory/75">
              Before there was a foundation, there was a friendship.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────── The friendship ───────────────── */}
      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Para lead>
              When Bruno met Caíque and his wife, Guilia, in Italy, the connection was immediate.
              What began as getting to know one another became a conversation about the kind of
              difference they wanted to make — and the young people they hoped to reach.
            </Para>
          </Reveal>
          <Reveal>
            <Para>
              Caíque carried a dream rooted in music: to give children, teenagers, and young adults
              the opportunity to learn, play, and discover what they could express through an
              instrument. He wanted that opportunity to reach beyond the families who could already
              afford it.
            </Para>
            <Para>
              Bruno carried a dream that reached into the classroom and beyond it — a welcoming place
              where young people could explore culture, learn languages, develop practical skills, and
              feel supported as they found their direction. A place where a family&rsquo;s financial
              circumstances would not decide whether a child could take part.
            </Para>
            <Para>
              As their conversations continued, they recognized something important: they were not
              describing two separate dreams.
            </Para>
          </Reveal>

          <PullQuote>They were imagining different parts of the same place.</PullQuote>

          <Reveal>
            <Para>
              A place where a young person could pick up an instrument, hold a paintbrush, practice a
              new language, or learn a skill that once seemed out of reach. Where asking a question
              would be welcomed. Where making a mistake would be part of learning — not a reason to
              feel ashamed.
            </Para>
          </Reveal>

          <PullQuote>
            A place where someone would notice their effort, learn their name, and expect to see them
            again.
          </PullQuote>

          <Reveal>
            <Para>
              That shared vision became the{' '}
              <strong className="font-semibold text-navy">Esposito&ndash;Dossantos Foundation</strong>{' '}
              — named for its two founding families, the Espositos and the Dos Santos. Its first cause,{' '}
              <strong className="font-semibold text-navy">United Youth Orchestra</strong>, is where the
              work began — and the Foundation exists to nurture many more associations and causes that
              help children in need.
            </Para>
          </Reveal>
        </div>
      </Section>

      {/* ───────────────── A place to belong ───────────────── */}
      <Section tone="ivory">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="eyebrow text-champagne-dark">More than lessons</p>
            <h2 className="mt-4 text-3xl sm:text-4xl">A place to belong.</h2>
            <Para>
              Our purpose begins with music, but it does not end there. We are building toward a
              connected learning environment that brings together music, painting, crafts, culture,
              languages, and practical skills for life in a changing world. Our particular concern is
              access: reaching young people whose families cannot afford the lessons, materials, and
              opportunities that help interests become abilities.
            </Para>
            <Para>
              Guilia helped give this vision a practical beginning through <em>Arte que Transforma</em>,
              a program of accessible music and arts activities built around learning, creativity, and
              community. That founding program is the starting point for the broader work we hope to
              develop.
            </Para>
            <Para>
              We do not expect every learner to become a professional musician or artist. We want them
              to have the chance to discover what interests them, practice something difficult, work
              with others, and recognize their own progress.
            </Para>
            <Para>
              For one learner, that might mean playing a piece they once thought was impossible. For
              another, it might mean explaining an idea in a new language, finishing a painting, or
              standing in front of a group and speaking with confidence.
            </Para>
          </Reveal>
          <PullQuote>Those are the moments we want to make room for.</PullQuote>
        </div>
      </Section>

      {/* ───────────────── The founders ───────────────── */}
      <Section tone="white">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-champagne-dark">Different strengths. A shared responsibility.</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">The people behind the promise</h2>
          <p className="mt-6 text-lg leading-relaxed text-softgray">
            Together, we are turning a shared ambition into the practical work of creating something
            dependable: suitable spaces, prepared teachers, learning materials, thoughtful programs,
            and relationships built over time.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-3">
          {founders.map((f, i) => (
            <Reveal as="div" key={f.name} delay={i * 90}>
              <div className="h-full rounded-2xl border border-navy/10 bg-warmwhite p-8 text-center transition hover:border-champagne/40 hover:shadow-lg hover:shadow-navy/5">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-champagne font-serif text-2xl font-semibold text-champagne-dark">
                  {f.initial}
                </span>
                <h3 className="mt-5 font-serif text-xl text-navy">{f.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest2 text-champagne-dark">
                  {f.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-softgray">{f.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-14 max-w-3xl">
          <Para>
            Our work begins in Rome. Our long-term ambition reaches across Europe, Brazil, the United
            States, and eventually other communities where the mission can be delivered responsibly.
            But wherever we grow, the purpose remains personal.
          </Para>
        </Reveal>

        <PullQuote>
          A young person should not have to give up an interest before discovering what they might
          become simply because their family cannot afford the first opportunity.
        </PullQuote>
      </Section>

      {/* ───────────────── Donate CTA ───────────────── */}
      <section className="relative overflow-hidden bg-navy-900 py-24 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,168,106,0.16),transparent_60%)]" />
        <div className="container-px relative z-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-champagne-light">Help make it possible</p>
            <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-ivory sm:text-4xl">
              Help us build a place where young people are welcomed, encouraged, and given room to grow.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ivory/75">
              We are at the beginning of this work. Your support can help turn a friendship and a
              shared dream into sustained opportunities to learn — not because we have every answer,
              but because we believe this is work worth doing, and we are committed to doing it with
              care.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link href="/donate" className="btn-primary">
                Donate now
              </Link>
              <Link href="/partners" className="btn-ghost-light">
                Partner or volunteer
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── Bruno's letter ───────────────── */}
      <Section tone="ivory">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <p className="eyebrow text-champagne-dark">A message from our co-founder</p>
            <blockquote className="mx-auto mt-6 max-w-2xl font-serif text-2xl leading-snug text-navy sm:text-3xl">
              &ldquo;I want what I have learned to become an opportunity for someone else.&rdquo;
            </blockquote>
          </Reveal>

          <div className="mt-12">
            <Reveal>
              <Para lead>
                I was born in Belo Horizonte, Brazil, and moved to the United States when I was ten
                years old. My life has since taken me across languages, cultures, and countries, and
                eventually to Rome — studying, building a career in technology and leadership, working
                in education, and learning how much can change when you keep developing your abilities.
              </Para>
              <Para>
                But when I think about why this matters to me, I do not begin with a job title. I begin
                with a child. A child who is curious about an instrument but has never had the chance to
                learn it. A teenager who has something to say but is still searching for the confidence
                — or the language — to say it. A young person with ideas and ambition, but without the
                money to pay for the course, the materials, or the extra support.
              </Para>
            </Reveal>

            <PullQuote>I want to help make more opportunities possible.</PullQuote>

            <Reveal>
              <h3 className="mt-10 font-serif text-xl text-navy">A father&rsquo;s reason to care</h3>
              <Para>
                I am a father. When I think about the future, I think about the encouragement
                my child will receive and the opportunities they will have to discover themselves.
                Then I think about other parents who want those same things for their child but have
                fewer resources to make them possible.
              </Para>
              <Para>
                The wish is not different. The love is not smaller. The child&rsquo;s potential does not
                matter less. That is why access matters so much to me. I want my child to grow up
                knowing that achievement is not only about what we can provide for ourselves — it is
                also about what we choose to make possible for others.
              </Para>

              <h3 className="mt-10 font-serif text-xl text-navy">
                Why music, culture, and practical learning belong together
              </h3>
              <Para>
                I play the saxophone. I do not see music, technology, and everyday skills as separate
                worlds a young person must choose between — I see different ways to explore,
                communicate, solve problems, and create. A teenager should be able to discover a love
                for painting and still learn how to manage a budget. They should be able to play music
                and learn another language.
              </Para>
              <Para>
                My dream is to help create a place where a young person does not need to arrive knowing
                what they are good at. They can arrive curious. They can arrive uncertain. They can
                begin.
              </Para>

              <h3 className="mt-10 font-serif text-xl text-navy">An invitation from me</h3>
              <Para>
                I am not asking you to be impressed by my biography. I am asking you to consider what we
                might make possible together. Imagine a young person returning to a class where someone
                remembers what they struggled with last week — and has prepared to help them try again.
                Imagine a parent hearing a practiced piece of music, or listening as their child
                explains something they have learned. Imagine that learner realizing:{' '}
                <em>I could not do this before. Now I can.</em>
              </Para>
              <Para>
                Your support is an act of trust. My responsibility is to help turn that trust into
                careful decisions, consistent work, and honest accounts of what we have — and have not —
                achieved. I cannot promise what every young person will become. But I can tell you what I
                am committed to building: more chances for them to learn, create, participate, and
                discover possibilities for themselves.
              </Para>
            </Reveal>

            <PullQuote>
              My story matters most to me when what I have learned becomes useful in someone else&rsquo;s
              life.
            </PullQuote>

            <Reveal>
              <p className="mt-10 font-serif text-lg text-navy">Bruno dos Santos</p>
              <p className="text-sm text-champagne-dark">Co-founder, Esposito&ndash;Dossantos Foundation</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ───────────────── Final invitation ───────────────── */}
      <Section tone="white">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl">Become part of the beginning</h2>
          <p className="mt-5 text-lg leading-relaxed text-softgray">
            As a supporter, educator, volunteer, or community partner — help us welcome the next young
            person through the door.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="btn-primary">
              Make a donation
            </Link>
            <Link href="/contact" className="btn-secondary">
              Get in touch
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
