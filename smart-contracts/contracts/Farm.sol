// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrchardQuality {
    address public admin;
    uint256 public recordCount;

    // Define a struct to store analysis data
    struct QualityRecord {
        uint256 id;           // Unique record ID
        string farmId;        // Unique identifier for the farm
        uint256 pest;         // Pest count per hectare
        uint256 yieldValue;   // Yield value (tons/hectare)
        uint256 ndvi;         // NDVI/GNDVI score
        uint256 overallScore; // Overall quality score (e.g., scaled 0-100)
        uint256 timestamp;    // Date and time of analysis (block timestamp)
    }

    // Mapping to store quality records by ID
    mapping(uint256 => QualityRecord) public records;

    // Event emitted when a new quality record is added
    event QualityRecordAdded(uint256 indexed id, string farmId, uint256 timestamp);

    // Set the deployer as the admin
    constructor() {
        admin = msg.sender;
    }

    // Modifier to restrict functions to only the admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized: admin only");
        _;
    }

    /// @notice Add a new quality record to the blockchain.
    /// @param _farmId Unique identifier for the farm.
    /// @param _pest Pest count per hectare.
    /// @param _yieldValue Yield value (tons/hectare).
    /// @param _ndvi NDVI/GNDVI score.
    /// @param _overallScore Overall quality score (e.g., scaled 0-100).
    function addQualityRecord(
        string memory _farmId,
        uint256 _pest,
        uint256 _yieldValue,
        uint256 _ndvi,
        uint256 _overallScore
    ) public onlyAdmin {
        recordCount++;
        QualityRecord memory newRecord = QualityRecord({
            id: recordCount,
            farmId: _farmId,
            pest: _pest,
            yieldValue: _yieldValue,
            ndvi: _ndvi,
            overallScore: _overallScore,
            timestamp: block.timestamp
        });
        records[recordCount] = newRecord;
        emit QualityRecordAdded(recordCount, _farmId, block.timestamp);
    }

    /// @notice Retrieve a quality record by its ID.
    /// @param _id The unique record ID.
    /// @return A QualityRecord struct containing the stored data.
    function getQualityRecord(uint256 _id) public view returns (QualityRecord memory) {
        require(_id > 0 && _id <= recordCount, "Record does not exist");
        return records[_id];
    }
}
