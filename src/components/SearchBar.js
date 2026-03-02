import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import './SearchBar.css';

const SUPPLY_CHAIN_TYPES = [
  { value: 'supplier', label: 'Supplier' },
  { value: 'manufacturer', label: 'Manufacturer' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'retail', label: 'Retail' },
];

const ATC_TYPES = [
  { value: 'tower', label: 'Tower' },
  { value: 'tracon', label: 'TRACON' },
  { value: 'center', label: 'Center' },
];

function SearchBar({ value, onSearch, onFilter, filters, onClearFilters, systemType }) {
  const [showFilters, setShowFilters] = useState(false);

  const typeOptions = systemType === 'supply-chain' ? SUPPLY_CHAIN_TYPES : ATC_TYPES;

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const handleClearSearch = () => {
    onSearch('');
  };

  const handleFilterChange = (filterType, filterValue) => {
    onFilter(filterType, filterValue);
  };

  const handleClearAll = () => {
    onSearch('');
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return filters.status.length > 0 || filters.type.length > 0;
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search nodes by name, type, or location..."
          value={value}
          onChange={handleSearchChange}
        />
        {value && (
          <button className="clear-search-btn" onClick={handleClearSearch}>
            <X size={16} />
          </button>
        )}
        <button 
          className={`filter-toggle-btn ${showFilters ? 'active' : ''} ${hasActiveFilters() ? 'has-filters' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
        </button>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-section">
            <h4>Status</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.status.includes('operational')}
                  onChange={(e) => {
                    const newStatus = e.target.checked 
                      ? [...filters.status, 'operational']
                      : filters.status.filter(s => s !== 'operational');
                    handleFilterChange('status', newStatus);
                  }}
                />
                <span className="status-operational">Operational</span>
              </label>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.status.includes('warning')}
                  onChange={(e) => {
                    const newStatus = e.target.checked 
                      ? [...filters.status, 'warning']
                      : filters.status.filter(s => s !== 'warning');
                    handleFilterChange('status', newStatus);
                  }}
                />
                <span className="status-warning">Warning</span>
              </label>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.status.includes('critical')}
                  onChange={(e) => {
                    const newStatus = e.target.checked 
                      ? [...filters.status, 'critical']
                      : filters.status.filter(s => s !== 'critical');
                    handleFilterChange('status', newStatus);
                  }}
                />
                <span className="status-critical">Critical</span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h4>Type</h4>
            <div className="filter-options">
              {typeOptions.map(({ value: typeValue, label }) => (
                <label key={typeValue} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.type.includes(typeValue)}
                    onChange={(e) => {
                      const newType = e.target.checked
                        ? [...filters.type, typeValue]
                        : filters.type.filter(t => t !== typeValue);
                      handleFilterChange('type', newType);
                    }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {(hasActiveFilters() || value) && (
            <button className="clear-filters-btn" onClick={handleClearAll}>
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
