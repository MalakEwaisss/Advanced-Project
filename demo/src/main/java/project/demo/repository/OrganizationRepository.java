package project.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import project.demo.models.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    
}
