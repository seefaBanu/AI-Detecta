import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Image,
  Video,
  Headphones,
  Code,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      title: "Image Detection",
      description:
        "Analyze images to detect AI-generated content with advanced computer vision",
      icon: Image,
      path: "/image",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Video Detection",
      description:
        "Detect AI-generated videos using state-of-the-art video analysis",
      icon: Video,
      path: "/video",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Audio Detection",
      description:
        "Identify AI-generated audio with sophisticated audio processing",
      icon: Headphones,
      path: "/audio",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Code Detection",
      description: "Analyze code to detect AI-generated programming patterns",
      icon: Code,
      path: "/code",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-accent" />
            </div>
            <h1 className="text-5xl font-bold gradient-text">AI-Detecta</h1>
          </div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered detection tools for images, videos, audio, and
            code. Identify AI-generated content with cutting-edge machine
            learning algorithms.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-8 card-hover"
              >
                <Link to={feature.path} className="block">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/70 mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-accent font-medium">
                        <span>Try Now</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-effect rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-6">Platform Statistics</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-accent mb-2">99.8%</div>
              <div className="text-white/70">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">10K+</div>
              <div className="text-white/70">Analyses Performed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">50ms</div>
              <div className="text-white/70">Average Response Time</div>
            </div>
          </div>
        </motion.div> */}
      </motion.div>
    </div>
  );
};

export default Home;
