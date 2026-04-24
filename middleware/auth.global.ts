export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, user } = useAuth()
  const localePath = useLocalePath()
  
  // Public routes that don't need auth
  const publicRoutes = ['/', '/login', '/become-doctor', '/contact', '/about-us']
  
  // Clean the path (remove locale prefix if any for checking)
  // For simplicity, we can check if it requires auth
  const isProtectedPath = to.path.includes('/dashboard') || to.path.includes('/case-submission') || to.path.includes('/retainer-case-submission') || to.path.includes('/admin')
  
  // If not logged in and trying to access protected route
  if (isProtectedPath && !isAuthenticated.value) {
    return navigateTo(localePath('/login'))
  }
  
  // If logged in
  if (isAuthenticated.value) {
    const role = user.value?.role
    const isAdminPath = to.path.includes('/admin')
    const isDoctorPath = to.path.includes('/dashboard') || to.path.includes('/case-submission') || to.path.includes('/retainer-case-submission')
    
    // Prevent logged-in users from seeing login page
    if (to.path === '/login' || to.path === '/ar/login') {
      if (role === 'admin') return navigateTo(localePath('/admin/patient-cases'))
      return navigateTo(localePath('/dashboard'))
    }
    
    // Role-based protection
    if (role === 'admin' && isDoctorPath) {
      return navigateTo(localePath('/admin/patient-cases'))
    }
    
    if (role === 'doctor' && isAdminPath) {
      return navigateTo(localePath('/dashboard'))
    }
  }
})
