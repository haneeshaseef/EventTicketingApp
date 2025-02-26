# Event Ticketing System - Angular Frontend

## Project Overview
This is an Angular frontend application for the Event Ticketing System, designed to provide a comprehensive user interface for event ticket management. The application supports three primary user roles: Admin, Customer, and Vendor, with role-specific dashboards and functionalities.

## Technologies Used
* Angular 16+
* TypeScript
* Angular Material
* RxJS
* Tailwind CSS

## Prerequisites
* Node.js 16+
* Angular CLI 16+
* npm 8+

## Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/haneeshaseef/EventTicketingApp.git
cd EventTicketingApp
```

### 3. Install Dependencies
```bash
npm install
```


### 5. Run the Application
```bash
# Development server
ng serve

# Production build
ng build 
```

## Project Structure
```
src/
├── app/
│   ├── components/       # Shared components
│   ├── pages/            # Page components
│   ├── services/         # API and business logic services
├── assets/               # Static assets
```

## Authentication Workflow
1. User selects role (Admin/Customer/Vendor)
2. Navigate to respective login/signup page
3. Backend validates credentials
4. Redirect to role-specific dashboard

## Testing
```bash
# Run unit tests
ng test

# Run end-to-end tests
ng e2e
```

## Troubleshooting
* Ensure backend is running
* Check CORS settings
* Verify API endpoint
* Review browser console for errors

## Additional Resources
* [Angular Documentation](https://angular.io/docs)
* [Angular Material](https://material.angular.io/)
* [RxJS Documentation](https://rxjs.dev/guide/overview)
* [Tailwind CSS](https://tailwindcss.com/docs)
* API Documentation (Swagger/OpenAPI): `https://haneeshaseef.github.io/EventTicketingSystemAPI/`
```
