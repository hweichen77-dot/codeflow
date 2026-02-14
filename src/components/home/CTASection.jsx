import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Ready to start building?
          </h2>
          <p className="text-lg text-gray-500 max-w-md mx-auto mb-8">
            No sign-up required. Jump into your first project and write real code in minutes.
          </p>
          <Link to={createPageUrl("Projects")}>
            <Button className="bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white h-13 px-8 text-base font-semibold rounded-xl shadow-xl shadow-purple-200/50 hover:shadow-purple-300/60 transition-all">
              Browse Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}