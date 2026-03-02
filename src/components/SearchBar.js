import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import './SearchBar.css';

const NODE_TYPES = {
  'supply-chain': [
    { value: 'supplier', label: 'Supplier' },
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'distributor', label: 'Distributor' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'retail', label: 'Retail' },
  ],
  atc: [
    { value: 'tower', label: 'Tower' },
    { value: 'tracon', label: 'TRACON' },
    { value: 'center', label: 'Center' },
  ],
};

function SearchBar({ onSearch, onFilter, filters, onClearFilters, systemType }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const nodeTypes = NODE_TYPES[systemType] || NODE_TYPES['supply-chain'];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleFilterChange = (filterType, value) => {
    onFilter(filterType, value);
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
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
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
              {nodeTypes.map(({ value, label }) => (
                <label key={value} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.type.includes(value)}
                    onChange={(e) => {
                      const newType = e.target.checked
                        ? [...filters.type, value]
                        : filters.type.filter(t => t !== value);
                      handleFilterChange('type', newType);
                    }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {hasActiveFilters() && (
            <button className="clear-filters-btn" onClick={onClearFilters}>
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
