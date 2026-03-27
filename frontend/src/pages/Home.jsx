import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Clock, Award } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden" data-testid="hero-section">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://static.prod-images.emergentagent.com/jobs/34148af1-0cf9-44be-92b6-9e1854c7a26c/images/0b400afdf48ed4ba92e5dea331087357f0dc70d94342d276cf8f08e7ab5de7c1.png)'
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            <h1 className="font-serif text-5xl md:text-6xl tracking-tighter leading-none text-white mb-6">
              Your Future Starts Here
            </h1>
            <p className="font-sans text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
              Apply to our college and track your admission journey every step of the way
            </p>
            <Link to="/register" data-testid="cta-apply-button">
              <Button variant="primary" className="bg-white text-[#002FA7] hover:bg-gray-100 px-8 py-3 text-lg">
                Start Your Application
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-[#F8F9FA]" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-slate-900 mb-4">
              Simple Application Process
            </h2>
            <p className="font-sans text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Our streamlined process makes it easy to apply and track your application status
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="text-center p-8" data-testid="feature-card-register">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-[#002FA7]" />
                </div>
                <h3 className="font-sans text-xl font-medium text-slate-900 mb-2">Register</h3>
                <p className="font-sans text-sm text-slate-500">
                  Create your account and start your application
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center p-8" data-testid="feature-card-submit">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-[#002FA7]" />
                </div>
                <h3 className="font-sans text-xl font-medium text-slate-900 mb-2">Submit</h3>
                <p className="font-sans text-sm text-slate-500">
                  Fill out your application and upload documents
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="text-center p-8" data-testid="feature-card-track">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-[#002FA7]" />
                </div>
                <h3 className="font-sans text-xl font-medium text-slate-900 mb-2">Track</h3>
                <p className="font-sans text-sm text-slate-500">
                  Monitor your application progress in real-time
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="text-center p-8" data-testid="feature-card-decision">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-[#002FA7]" />
                </div>
                <h3 className="font-sans text-xl font-medium text-slate-900 mb-2">Decision</h3>
                <p className="font-sans text-sm text-slate-500">
                  Receive your admission decision online
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-slate-900 mb-4">
            Ready to Begin?
          </h2>
          <p className="font-sans text-base text-slate-600 leading-relaxed mb-8">
            Join thousands of students who have started their journey with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" data-testid="cta-register">
              <Button variant="primary" className="px-8 py-3">Create Account</Button>
            </Link>
            <Link to="/login" data-testid="cta-login">
              <Button variant="secondary" className="px-8 py-3">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
