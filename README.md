# Outreach Tracker

A professional, modern CRM application designed to track networking and outreach efforts. Built with React and Supabase, it allows you to manage contacts, track conversation statuses, and sync your data across all your devices.

## Features

*   **Smart Contact Management**: Track names, companies, titles, and industries.
*   **Status Tracking**: Visual pipeline from "To Contact" to "Call Completed".
*   **Cloud Sync**: Powered by **Supabase**, your data is safely stored in the cloud and accessible from any device.
*   **Secure Authentication**: Simple email/password login to protect your data.
*   **LinkedIn Integration**: Quick-access links to LinkedIn profiles directly from the dashboard.
*   **Filtering & Sorting**: Powerful filters for Status, Industry, and Follow-up dates.
*   **Responsive Design**: Fully optimized for both Desktop and Mobile web.

## Tech Stack

*   **Frontend**: React, Vite, TypeScript
*   **Styling**: Tailwind CSS, Shadcn UI
*   **Backend/Database**: Supabase (PostgreSQL + Auth)
*   **Icons**: Lucide React

## Getting Started

### Prerequisites

*   Node.js (v16 or higher)
*   A Supabase account (free)

### Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

3.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Deployment

This project is build-ready for Vercel or Netlify.

1.  Push your code to GitHub.
2.  Import the project into Vercel/Netlify.
3.  Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the project's Environment Variables in the hosting dashboard.
4.  Deploy!

## License

Private / Personal Use
