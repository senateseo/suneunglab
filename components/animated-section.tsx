"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

// Section component with animations
export default function AnimatedSection({
  section,
  index,
}: {
  section: any;
  index: number;
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: "-10% 0px",
  });

  // Get correct image paths based on section ID
  const getImagePath = (sectionId: string, index: number) => {
    if (sectionId === "testimonials") {
      return `/img/img-testimonials-${index + 1}.png`;
    }
    return `/img/img-${sectionId}.png`;
  };

  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      ref={ref}
      key={section.id}
      className="min-h-screen w-full flex flex-col justify-center items-center px-4"
    >
      <div className="w-full max-w-xl md:max-w-3xl mx-auto px-2 md:px-4 text-center">
        {section.hasImage && (
          <div
            className={`grid grid-cols-${
              section.imageCount === 1 ? 1 : 2
            } gap-2 place-content-center`}
          >
            {Array.from({ length: section.imageCount || 0 }).map(
              (_, imgIndex) => (
                <motion.div
                  key={`img-${imgIndex}`}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    delay: inView ? Math.min(0.3 + imgIndex * 0.2, 1) : 0,
                    duration: 0.4,
                  }}
                  className="my-6 md:my-8"
                >
                  <Image
                    src={getImagePath(section.id, imgIndex)}
                    alt={`${section.id} image ${imgIndex + 1}`}
                    width={400}
                    height={300}
                    className="mx-auto rounded-lg shadow-lg w-full max-w-[300px] md:max-w-[600px] h-auto"
                  />
                </motion.div>
              )
            )}
          </div>
        )}

        {section.content.map((line: any, i: number) => (
          <motion.div
            key={i}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeInVariant}
            transition={{
              delay: inView ? Math.min(i * 0.08, 1) : 0,
              duration: 0.4,
            }}
            className="text-xl md:text-2xl leading-relaxed text-gray-800 my-1 md:my-2"
          >
            {typeof line === "string" ? (line === "" ? "\u00A0" : line) : line}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
