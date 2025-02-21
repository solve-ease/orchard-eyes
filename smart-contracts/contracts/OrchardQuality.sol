// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrchardQuality {
    address public admin;
    uint256 public recordCount;

    struct QualityRecord {
        uint256 id;
        string farmId;
        uint256 pest;
        uint256 yieldValue;
        uint256 ndvi;
        uint256 overallScore;
        uint256 timestamp;
    }

    // Mapping from record id to QualityRecord.
    mapping(uint256 => QualityRecord) public records;
    // Mapping to prevent duplicate records based on their content.
    mapping(bytes32 => bool) private recordExists;
    // Mapping from farmId to an array of record ids.
    mapping(string => uint256[]) private farmRecords;
    // Mapping from farmId to the most recent record id for that farm.
    mapping(string => uint256) private latestRecordForFarm;

    event QualityRecordAdded(uint256 indexed id, string farmId, uint256 timestamp);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized: admin only");
        _;
    }

    /// @notice Adds a new quality record.
    /// @dev Generates a unique hash from the record data to prevent duplicates.
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
        // Create a unique hash based on record content.
        bytes32 recordHash = keccak256(abi.encodePacked(_farmId, _pest, _yieldValue, _ndvi, _overallScore));
        require(!recordExists[recordHash], "This record already exists");

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
        recordExists[recordHash] = true;
        // Add record id to the farm's record array.
        farmRecords[_farmId].push(recordCount);
        // Update the latest record for this farm.
        latestRecordForFarm[_farmId] = recordCount;

        emit QualityRecordAdded(recordCount, _farmId, block.timestamp);
    }

    /// @notice Retrieves all quality records for a given farm.
    /// @param _farmId The unique identifier for the farm.
    /// @return An array of QualityRecord structs.
    function getAllRecordsForFarm(string memory _farmId) public view returns (QualityRecord[] memory) {
        uint256[] storage recordIds = farmRecords[_farmId];
        QualityRecord[] memory results = new QualityRecord[](recordIds.length);
        for (uint256 i = 0; i < recordIds.length; i++) {
            results[i] = records[recordIds[i]];
        }
        return results;
    }

    /// @notice Retrieves the most recent quality record for a given farm.
    /// @param _farmId The unique identifier for the farm.
    /// @return The latest QualityRecord struct.
    function getLatestRecordForFarm(string memory _farmId) public view returns (QualityRecord memory) {
        uint256 lastRecordId = latestRecordForFarm[_farmId];
        require(lastRecordId != 0, "No records found for this farm");
        return records[lastRecordId];
    }
}
