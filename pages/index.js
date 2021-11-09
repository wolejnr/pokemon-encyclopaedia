import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const defaultEndpoint = "https://pokeapi.co/api/v2/pokemon/"

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(defaultEndpoint)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default function Home({ data }) {
  const { count, next, prev, results: defaultResults = [] } = data
  const [results, updateResults] = useState(defaultResults)

  const [page, updatePage] = useState({
    count,
    next,
    prev,
    current: defaultEndpoint
  })

  // Destructure current object from the page
  const { current } = page

  useEffect(() => {
    if(current === defaultEndpoint) return;

    async function request(){
      const res = await fetch(current)
      const nextData = await res.json()

      updatePage({
        current,
        next: nextData.next,
        prev: nextData.prev
      })

      if(!nextData.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults(prev => {
        return [
          ...prev,
          ...nextData.results
        ]
      })
    }

    request()
  }, [current])

  function handleLoadMore(){
    updatePage(prev => {
      return {
        ...prev,
        current: page?.next
      }
    })
  }

  function handleOnSubmitSearch(e) {
    e.preventDefault()

    const {currentTarget = {}} = e
    const fields = Array.from(currentTarget?.elements)
    const fieldQuery = fields.find(field => field.name === 'query')

    //console.log(fields)

    const value = fieldQuery.value || ''
    const endpoint = `https://pokeapi.co/api/v2/pokemon/${value}`

    console.log(endpoint)

    updatePage({
      current: endpoint
    })
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Pokemon Encyclopaedia</title>
        <meta name="description" content="Pokemon Encyclopaedia App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the Pokemon Encyclopaedia!
        </h1>

        <p>Did you know that there are currently {count} known pokemons?</p>

        {/* Need to figure out how to implement filtering search  */}

        {/* <form className={styles.search} onSubmit={handleOnSubmitSearch}> 
          <input type="search" name="query" />
          <button>Search</button>
        </form> */}

        <section>
          
          <div>
            
            <ul className={styles.grid}>
              {results.map(result => {
                const {name, url} = result

                return (
                  <li className={styles.card} key={name}>
                    <Link href={`/pokemon/${name}`}>
                      <a>
                        {name}
                      </a>
                    </Link>
                  </li>
                )
              })}
              
            </ul>
          </div>
        </section>

        <p>
          <button onClick={handleLoadMore}>Load More</button>
        </p>
        
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
