// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VoteSoul is ERC20 {
    uint256 MAX_INT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

    struct Conditions {
        bool distribution_ended;
        uint32 quorum;
        uint32 non_zero_adresses;
        uint32 envelopes_cast;
        uint32 envelopes_opened;
    }

    struct Refund {
        uint256 amount;
        address candidate;
    }

    struct CandidateInfo {
        bool is_candidate;
        uint256 soul;
    }

    event LetTheVoteBegin();
    event EnvelopeCast(address _voter);
    event EnvelopeOpen(address _voter, address _candidate, uint _soul);
    event EnvelopeOpenInvalid(address _voter);
    event NewMayor(address candidate);
    event SayonaraEveryone();

    address deployer;
    address escrow;
    address[] candidates;
    address[] voters;

    Conditions voting_condition;

    mapping(address => bytes32) envelopes;
    mapping(address => Refund) souls;
    mapping(address => CandidateInfo) candidates_info;

    /**
     * @param _quorum (address) The number of voters required to finalize the confirmation
     * @param _escrow (address) The address of the escrow account
     * @param _candidates (address[]) The addresses of the mayor candidates
     */
    constructor(uint32 _quorum, address _escrow, address[] memory _candidates) ERC20("VoteSoul", "SOUL") {
        deployer = _msgSender();
        voting_condition = Conditions({distribution_ended: false, quorum: _quorum, non_zero_adresses: 0, envelopes_cast: 0, envelopes_opened: 0});
        escrow = _escrow;
        candidates = _candidates;
        for(uint i = 0; i < candidates.length; i++) {
            candidates_info[candidates[i]] = CandidateInfo({is_candidate: true, soul: 0});
        }
    }


    modifier deployerOnly() {
        require(deployer == _msgSender(), "Only the contract deployer can use this function");
        _;
    }

    // The contract deployer decides when to start voting, however after doing so he cannot mint anymore. 
    modifier canMint() {
        require(!voting_condition.distribution_ended, "Distribution phase has already ended.");
        _;
    }

    // Someone can vote as long as the quorum is not reached
    modifier canVote() {
        require(voting_condition.envelopes_cast < voting_condition.quorum, "Cannot vote now, voting quorum has been reached");
        _;   
    }
    
    // Envelopes can be opened only after receiving the quorum
    modifier canOpen() {
        require(voting_condition.envelopes_cast >= voting_condition.quorum, "Cannot open an envelope, voting quorum not reached yet");
        _;
    }
    
    // The outcome of the confirmation can be computed as soon as all the cast envelopes have been opened
    modifier canCheckOutcome() {
        require(voting_condition.envelopes_opened >= voting_condition.quorum, "Cannot check the winner, need to open all the sent envelopes");
        _;
    }


    /** 
     * @dev Mints the SOUL ERC20-tokens used for voting
     * 
     * NOTE: Access limited to the contract deployer only. In real-life democratic-voting scenario every eligible address should be minted an equal amount of soul.
     * I assume providing such responsibility is not a part of the task and the contract deployer is justiful from the voter's standpoint.
     */
    function mint(address to, uint256 amount) canMint deployerOnly public returns (bool) {
        if(to != address(0) && balanceOf(to) == 0) voting_condition.non_zero_adresses++;

        _mint(to, amount);
        return true;
    }

    /**
     * @dev Ends minting phase, enables the use of cast_envelope (voting function)
     */
    function begin_voting() canMint deployerOnly public returns (bool) {
        require(voting_condition.non_zero_adresses >= voting_condition.quorum, "Inefficient voting participants to reach the quorum.");

        voting_condition.distribution_ended = true;
        emit LetTheVoteBegin();
        return true;
    }

    /**
     * @dev Compute a voting envelope
     * @param _candidate (address) The preferred voting candidate
     * @param _soul (uint) The soul associated to the vote
     */    
    function compute_envelope(address _candidate, uint _soul) public view returns(bytes32) {
        return keccak256(abi.encode(_msgSender(), _candidate, _soul));
    }

    /**
     * @dev Store a received voting envelope
     * @param _envelope The envelope represented as the keccak256 hash of (sigil, doblon, soul) 
     */
    function cast_envelope(bytes32 _envelope) canVote public returns (bool) {
        
        if(envelopes[_msgSender()] == 0x0) {
            voting_condition.envelopes_cast++;
            voters.push(_msgSender());
        }

        envelopes[_msgSender()] = _envelope;
        emit EnvelopeCast(_msgSender());
        return true;
    }

    /**
     * @dev Open an envelope and store the vote information, transfers SOUL to the address of the contract
     * @param _candidate (address) The voting preference
     * @param _soul (uint) Amount of SOUL bet for the candidate
     */
    function open_envelope(address _candidate, uint _soul) canOpen public returns (bool) {
        require(envelopes[_msgSender()] != 0x0, "The sender has no envelope to open");    // did not vote or already opened
        
        bytes32 _cast_envelope = envelopes[_msgSender()];
        bytes32 _sent_envelope = compute_envelope(_candidate, _soul);
        require(_cast_envelope == _sent_envelope, "Sent envelope does not correspond to the one cast");

        envelopes[_msgSender()] = 0x0;

        // if the voter cannot pay his bet or votes for a non-candidate address, his vote is invalidated
        if(balanceOf(_msgSender()) >= _soul && candidates_info[_candidate].is_candidate) {
            candidates_info[_candidate].soul += _soul;
            souls[_msgSender()] = Refund({amount: _soul, candidate: _candidate});
            transfer(address(this), _soul);

            emit EnvelopeOpen(_msgSender(), _candidate, _soul);
        } else {
            emit EnvelopeOpenInvalid(_msgSender());
        }
        
        voting_condition.envelopes_opened++;
        
        return true;
    }

    /**
     * @dev Resolves the winner of the voting and transfers SOUL token as specified.
     */
    function check_outcome() canCheckOutcome deployerOnly public returns (bool) {
        address winner;
        bool only_winner;
        
        for(uint i = 0; i < candidates.length; i++) {
            if(candidates_info[candidates[i]].soul > candidates_info[winner].soul) {
                winner = candidates[i];
                only_winner = true;
            } else if(candidates_info[candidates[i]].soul == candidates_info[winner].soul) {
                only_winner = false;
            }
        }

        if(only_winner) {
            for(uint i = 0; i < voters.length; i++) {
                _transfer(
                    address(this), 
                    souls[voters[i]].candidate == winner ? winner : voters[i],
                    souls[voters[i]].amount
                );
                souls[voters[i]].amount = 0;
            }

            emit NewMayor(winner);
            
        } else {
            _transfer(address(this), escrow, balanceOf(address(this)));
            emit SayonaraEveryone();
        }
        return true;
    }

    /**
     * @dev Returns bool if quorum has been reached. For the UI purposes.
     */
    function is_quorum_reached() public view returns (bool) {
        return voting_condition.envelopes_cast >= voting_condition.quorum;
    }

    /**
     * @dev Returns the list of candidates. For the UI purposes.
     */
    function candidates_list() public view returns (address[] memory) {
        return candidates;
    }

}
