import { motion } from 'framer-motion'
import { Camera, Sparkles } from 'lucide-react'

const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="relative">
          <Camera className="w-8 h-8 text-accent" />
          <Sparkles className="w-4 h-4 text-primary-400 absolute -top-1 -right-1" />
        </div>
        <h1 className="text-3xl font-bold gradient-text">
          AI Image Detection
        </h1>
      </div>
      <p className="text-center text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
        Upload an image to analyze with cutting-edge artificial intelligence. 
        Get instant insights and detailed analysis powered by advanced machine learning.
      </p>
    </motion.header>
  )
}

export default Header 