/* eslint-disable @typescript-eslint/no-var-requires */
import Heading from '@theme/Heading'
import clsx from 'clsx'

import styles from './styles.module.css'

const FeatureList = [
  {
    title: 'Easy to Use',
    // eslint-disable-next-line no-undef
    Svg: require('@site/static/img/easy.svg').default,
    description: (
      <>
        React Nepali DateTime Picker was designed to create an easy way to
        integrate Nepali datetime in React applications.
      </>
    ),
  },
  {
    title: 'Built with React and TailwindCSS',
    // eslint-disable-next-line no-undef
    Svg: require('@site/static/img/undraw_tailwind.svg').default,
    description: (
      <>
        Thie component library is highly customizable to meet the needs of any
        user.
      </>
    ),
  },
  {
    title: 'Reusable Components',
    // eslint-disable-next-line no-undef
    Svg: require('@site/static/img/components.svg').default,
    description: (
      <>
        It offers a collection of reusable components that will enable seamless
        date picking, time picking, and datetime picking capabilities.
      </>
    ),
  },
]

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
