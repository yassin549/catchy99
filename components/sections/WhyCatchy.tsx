import InfoCard from './InfoCard'

const features = [
  {
    title: 'Qualité',
    text: 'Produits 100% authentiques, contrôlés en boutique.',
  },
  {
    title: 'Service 7/7',
    text: 'Une équipe à votre écoute toute la semaine, du lundi au dimanche.',
  },
  {
    title: 'Meilleur prix',
    text: 'Nos offres flash à –150 DT et bons plans exclusifs.',
  },
]

const WhyCatchy = () => {
  return (
    <section className='py-20 bg-black text-white'>
      <div className='container mx-auto px-4'>
        <h2 className='text-4xl font-bold text-center mb-12'>
          Pourquoi nous choisir ?
        </h2>
        <div className='grid md:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <InfoCard
              key={index}
              title={feature.title}
              text={feature.text}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyCatchy
