import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import pstyles from '../../styles/Pokemon.module.scss'
import Link from 'next/link'

const defaultEndpoint = "https://pokeapi.co/api/v2/pokemon/"

// This gets called on every request
export async function getServerSideProps({query}) {
  const { id } = query
  // Fetch data from external API
  const res = await fetch(`${defaultEndpoint}/${id}`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default function Pokemon({ data }) {
  //console.log('data', data)
  const moves = data.moves || [];
  let pokemonName = data.name;
  let pokemonImage = data.sprites.front_default
  let pokemonWeight = data.weight
  let pokemonType = data.types[0].type.name

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokemon Encyclopaedia</title>
        <meta name="description" content="Pokemon Encyclopaedia App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title, pstyles.headings}>
          {pokemonName}
        </h1>

        <section className={pstyles.profile}>
          <div className={pstyles.left}>
            <Image src={pokemonImage} alt={`${pokemonName} image`} width={200} height={200} />
          </div>
          <div className={pstyles.right}>
            <b>Type:</b> <span className={pstyles.headings}>{pokemonType}</span><br/>
            <b>Weight:</b> {pokemonWeight} <br/>
            <b>Abilities:</b> <br/>
              <ul className="grid">
                {moves.slice(0, 5).map((currObj, index, moves) => {
                  return (
                    <li className="card" key={index}>
                        {moves[index].move.name}
                    </li>
                  )
                })}
              </ul>
          </div>
        </section>

        <h3>
          <Link href="/">
            <a>Back to Home</a>
          </Link>
        </h3>
        
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
