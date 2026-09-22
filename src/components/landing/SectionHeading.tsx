export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-4 text-xs font-semibold tracking-[.18em] uppercase text-base-content/55">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-medium leading-tight tracking-[-.035em] text-balance sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-base-content/60">
        {description}
      </p>
    </div>
  )
}
