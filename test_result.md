#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  TechHub UPE es una plataforma web en español que agrega contenido de terceros (cursos, eventos, becas, noticias, certificaciones) y permite publicaciones nativas de trabajo con seguimiento de aplicaciones. Se enfoca principalmente en carreras tecnológicas pero también incluye otros campos profesionales.
  
  Problemas críticos reportados por el usuario:
  1. Botones no funcionales: "eventos", "guardados", "todas las categorías", "todas las vacantes"
  2. Ubicaciones de vacantes: deben ser Ciudad del Este para presencial, otras ciudades solo para online
  3. Creación de cuenta empresarial sigue defaulteando a estudiante
  4. UI cards desiguales en márgenes, espacios, tamaños
  5. Falta sección de carga de archivos PDF (CV, certificados) en perfil de estudiantes

backend:
  - task: "API endpoints para cursos, eventos, jobs"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Todos los endpoints están implementados y funcionando correctamente"

  - task: "Autenticación con Google OAuth y roles"
    implemented: true
    working: false
    file: "/app/backend/server.py"
    stuck_count: 2
    priority: "high"
    needs_retesting: true
    status_history:
      - working: false
        agent: "user"
        comment: "Usuario reporta que la creación de cuenta empresa sigue defaulteando a estudiante"

  - task: "Sistema de usuarios y perfiles"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Endpoints de perfil funcionando correctamente"

  - task: "Sistema de guardados (saved items)"
    implemented: true
    working: false
    file: "/app/backend/server.py"
    stuck_count: 1
    priority: "high"
    needs_retesting: true
    status_history:
      - working: false
        agent: "user"
        comment: "Usuario reporta que el botón de guardados no funciona"

frontend:
  - task: "Navegación y routing"
    implemented: true
    working: false
    file: "/app/frontend/src/App.js"
    stuck_count: 3
    priority: "high"
    needs_retesting: true
    status_history:
      - working: false
        agent: "user"
        comment: "Botones eventos, guardados, filtros de categorías no funcionan"

  - task: "Componente de creación de cuenta (empresa vs estudiante)"
    implemented: true
    working: false
    file: "/app/frontend/src/App.js"
    stuck_count: 4
    priority: "high"
    needs_retesting: true
    status_history:
      - working: false
        agent: "user"
        comment: "Sigue creando solo cuentas de estudiante, no empresas"

  - task: "Filtros de contenido (categorías, vacantes)"
    implemented: true
    working: false
    file: "/app/frontend/src/App.js"
    stuck_count: 2
    priority: "high"
    needs_retesting: true
    status_history:
      - working: false
        agent: "user"
        comment: "Filtros todas las categorías y todas las vacantes no funcionan"

  - task: "Consistencia UI de cards"
    implemented: false
    working: false
    file: "/app/frontend/src/App.js"
    stuck_count: 2
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: false
        agent: "user"
        comment: "Cards tienen márgenes, espacios y tamaños desiguales"

  - task: "Sección de carga de archivos en perfil"
    implemented: false
    working: false
    file: "/app/frontend/src/App.js"
    stuck_count: 1
    priority: "high"
    needs_retesting: true
    status_history:
      - working: false
        agent: "user"
        comment: "Falta funcionalidad completa de carga de PDF (CV, certificados)"

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus:
    - "Navegación y routing"
    - "Componente de creación de cuenta (empresa vs estudiante)"
    - "Filtros de contenido (categorías, vacantes)"
    - "Sección de carga de archivos en perfil"
  stuck_tasks:
    - "Componente de creación de cuenta (empresa vs estudiante)"
    - "Navegación y routing"
    - "Filtros de contenido (categorías, vacantes)"
  test_all: false
  test_priority: "stuck_first"

agent_communication:
  - agent: "main"
    message: "Usuario reportó 5 problemas críticos después de rewrite reciente de App.js. Necesito verificar si los cambios realmente funcionaron y arreglar los problemas persistentes. Comenzaré con testing del backend para verificar que la base funciona correctamente."