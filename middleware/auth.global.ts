export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, user, token, fetchUser } = useAuth()
  
  // Restore user session if token exists but user state is empty
  if (token.value && !user.value) {
    await fetchUser()
  }
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
    const isStaff = role === 'admin' || role === 'employee'
    
    // Prevent logged-in users from seeing login page
    if (to.path === '/login' || to.path === '/ar/login') {
      if (isStaff) return navigateTo(localePath('/admin/patient-cases'))
      return navigateTo(localePath('/dashboard'))
    }
    
    // Role-based protection
    if (isStaff && isDoctorPath) {
      return navigateTo(localePath('/admin/patient-cases'))
    }
    
    if (role === 'doctor' && isAdminPath) {
      return navigateTo(localePath('/dashboard'))
    }

    // Employee specific sub-page permissions enforcement
    if (role === 'employee' && isAdminPath) {
      // Strictly admin only
      if (to.path.includes('/admin/users')) {
        return navigateTo(localePath('/admin/patient-cases'))
      }

      const perms = user.value?.permissions ? (typeof user.value.permissions === 'string' ? JSON.parse(user.value.permissions) : user.value.permissions) : null
      if (perms && perms.pages) {
        let hasAccess = true
        if (to.path.includes('/admin/patient-cases') && !perms.pages.patient_cases) hasAccess = false
        if (to.path.includes('/admin/categories') && !perms.pages.categories) hasAccess = false
        if (to.path.includes('/admin/notifications') && !perms.pages.notifications) hasAccess = false
        
        if (!hasAccess) {
          if (perms.pages.patient_cases) return navigateTo(localePath('/admin/patient-cases'))
          if (perms.pages.categories) return navigateTo(localePath('/admin/categories'))
          if (perms.pages.notifications) return navigateTo(localePath('/admin/notifications'))
          return navigateTo(localePath('/admin'))
        }
      }
    }
  }
})
