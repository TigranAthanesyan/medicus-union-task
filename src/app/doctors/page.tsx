"use client";

import React, { useState, useMemo } from "react";
import MainContainer from "../../components/MainContainer";
import { DoctorCard } from "../../components/DoctorCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import useDoctorsData from "../../hooks/useDoctorsData";
import useSpecializationsData from "../../hooks/useSpecializationsData";
import { getAvailableCountries } from "../../utils/countries";
import { DataFetchStatus } from "../../types";
import styles from "./styles.module.css";

export default function DoctorsPage() {
  const { doctors, status } = useDoctorsData();
  const { specializations, status: specializationsStatus } = useSpecializationsData();

  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const availableCountries = useMemo(() => {
    return getAvailableCountries(doctors);
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      if (
        selectedSpecialization &&
        (!doctor.specializations ||
          !doctor.specializations.includes(selectedSpecialization))
      ) {
        return false;
      }

      if (selectedCountry && doctor.country !== selectedCountry) {
        return false;
      }

      if (
        searchTerm &&
        !doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [doctors, selectedSpecialization, selectedCountry, searchTerm]);

  const clearFilters = () => {
    setSelectedSpecialization("");
    setSelectedCountry("");
    setSearchTerm("");
  };

  const renderFilters = () => (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <label htmlFor="search" className={styles.filterLabel}>
            Search by name
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="specialization" className={styles.filterLabel}>
            Specialization
          </label>
          <select
            id="specialization"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className={styles.filterSelect}
            disabled={specializationsStatus !== DataFetchStatus.Success}
          >
            <option value="">---</option>
            {specializations.map((spec) => (
              <option key={spec.key} value={spec.key}>
                {spec.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="country" className={styles.filterLabel}>
            Country
          </label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">---</option>
            {availableCountries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.filtersActions}>
        <div className={styles.activeFilters}>
          {(selectedSpecialization || selectedCountry || searchTerm) && (
            <span className={styles.resultsCount}>
              {filteredDoctors.length} of {doctors.length} doctors
            </span>
          )}
        </div>
        {(selectedSpecialization || selectedCountry || searchTerm) && (
          <button onClick={clearFilters} className={styles.clearButton}>
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (status) {
      case DataFetchStatus.Initial:
      case DataFetchStatus.InProgress:
        return (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
            <p>Loading doctors...</p>
          </div>
        );
      case DataFetchStatus.Error:
        return (
          <div className={styles.errorContainer}>
            <h2>Error Loading Doctors</h2>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        );
      case DataFetchStatus.Success:
        return (
          <>
            {renderFilters()}
            {filteredDoctors.length === 0 ? (
              <div className={styles.emptyState}>
                <h2>No Doctors Found</h2>
                <p>
                  {doctors.length === 0
                    ? "There are currently no doctors registered in the system."
                    : "No doctors match your current filters. Try adjusting your search criteria."}
                </p>
                {doctors.length > 0 && (
                  <button onClick={clearFilters} className={styles.clearButton}>
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.doctorsGrid}>
                {filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} showSpecializations />
                ))}
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <MainContainer>
      <header className={styles.header}>
        <h1 className={styles.title}>Find Your Doctor</h1>
        <p className={styles.subtitle}>
          Connect with qualified healthcare professionals
        </p>
      </header>
      {renderContent()}
    </MainContainer>
  );
}
