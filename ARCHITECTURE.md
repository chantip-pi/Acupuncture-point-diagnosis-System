# Clean Architecture Documentation

This project has been refactored to follow Clean Architecture principles, providing better separation of concerns, testability, and maintainability.

## Architecture Layers

### 1. Domain Layer (`app/domain/`)

The innermost layer containing business logic and entities.

#### Entities (`app/domain/entities/`)
- **Patient.ts**: Patient entity with business logic
- **Staff.ts**: Staff entity

#### Value Objects (`app/domain/value-objects/`)
- **PhoneNumber.ts**: Validates and encapsulates phone number logic
- **DateOfBirth.ts**: Handles date of birth with age calculation

#### Repositories (`app/domain/repositories/`)
- **IPatientRepository.ts**: Interface for patient data operations
- **IStaffRepository.ts**: Interface for staff data operations

#### Services (`app/domain/services/`)
- **PatientValidationService.ts**: Centralized validation logic for patients

### 2. Application Layer (`app/application/`)

Contains use cases and DTOs that orchestrate domain logic.

#### DTOs (`app/application/dtos/`)
- **PatientDTO.ts**: Data transfer objects for patient operations
- **StaffDTO.ts**: Data transfer objects for staff operations

#### Use Cases (`app/application/use-cases/`)
- **patient/**: Patient-related use cases
  - `AddPatientUseCase.ts`
  - `GetPatientListUseCase.ts`
  - `GetPatientByIdUseCase.ts`
  - `UpdatePatientUseCase.ts`
  - `GetPatientsByAppointmentDateUseCase.ts`
- **staff/**: Staff-related use cases
  - `LoginUseCase.ts`
  - `GetStaffListUseCase.ts`
  - `GetStaffByUsernameUseCase.ts`

### 3. Infrastructure Layer (`app/infrastructure/`)

Handles external concerns like API calls and data persistence.

#### Configuration (`app/infrastructure/config/`)
- **api.config.ts**: Centralized API endpoint configuration

#### HTTP Client (`app/infrastructure/http/`)
- **HttpClient.ts**: Abstract HTTP client interface and Fetch implementation

#### Repositories (`app/infrastructure/repositories/`)
- **PatientRepository.ts**: Implementation of IPatientRepository using HTTP client
- **StaffRepository.ts**: Implementation of IStaffRepository using HTTP client

#### Dependency Injection (`app/infrastructure/di/`)
- **container.ts**: Dependency injection container that wires up all dependencies

### 4. Presentation Layer (`app/presentation/`)

UI components and hooks that interact with use cases.

#### Hooks (`app/presentation/hooks/`)
- **useAddPatient.ts**: Hook for adding patients
- **useGetPatientList.ts**: Hook for fetching patient list
- **useGetPatientById.ts**: Hook for fetching patient by ID
- **useUpdatePatient.ts**: Hook for updating patients
- **useGetPatientsByAppointmentDate.ts**: Hook for fetching patients by appointment date
- **useLogin.ts**: Hook for staff login
- **useGetStaffList.ts**: Hook for fetching staff list
- **useGetStaffByUsername.ts**: Hook for fetching staff by username

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a clear responsibility
2. **Testability**: Business logic can be tested independently of UI and infrastructure
3. **Maintainability**: Changes to one layer don't affect others
4. **Flexibility**: Easy to swap out implementations (e.g., change API client)
5. **Scalability**: Easy to add new features following the same pattern

## Usage Example

### Adding a New Feature

1. **Domain Layer**: Define entity and repository interface
2. **Application Layer**: Create use case and DTO
3. **Infrastructure Layer**: Implement repository
4. **Presentation Layer**: Create hook and use in component

### Example: Adding a Patient

```typescript
// In a component
import { useAddPatient } from "~/presentation/hooks/useAddPatient";

const { addPatient, loading, error } = useAddPatient();

const handleSubmit = async () => {
  const result = await addPatient({
    name_surname: "John Doe",
    phone_number: "1234567890",
    // ... other fields
  });
  
  if (result.success) {
    // Handle success
  }
};
```

## Configuration

API endpoints are centralized in `app/infrastructure/config/api.config.ts`. To change the API base URL, update this file.

## Dependencies Flow

```
Presentation → Application → Domain
     ↓              ↓
Infrastructure ←────┘
```

- Presentation depends on Application
- Application depends on Domain
- Infrastructure implements Domain interfaces
- Application uses Infrastructure through Domain interfaces

This ensures Domain and Application layers are independent of external frameworks and libraries.
