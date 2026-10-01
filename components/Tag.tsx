import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="mr-3 text-sm font-medium text-primary-600 uppercase hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
