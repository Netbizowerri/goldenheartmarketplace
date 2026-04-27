import React, { useState } from "react";
import { motion } from "motion/react";
import { Container } from "./ui/Container";

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center"
          >
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gold-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black mb-4">Admin Dashboard</h1>
            <p className="text-medium-grey mb-6">
              All lead submissions are sent directly to your Privyr CRM webhook.
              No admin dashboard is needed as leads are handled entirely by Privyr.
            </p>
            <p className="text-sm text-medium-grey">
              To view your leads, please log in to your Privyr account directly.
            </p>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};
