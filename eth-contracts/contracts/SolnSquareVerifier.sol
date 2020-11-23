pragma solidity >=0.4.21 <0.6.1;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./Verifier.sol";
import "./ERC721Mintable.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is RealEstateNdERC721Token, Verifier {

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        bool used;
        address verifierAddress;
        uint256 tokenId;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(bytes32 key, address verifierAddress, uint256 tokenId);


    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(bytes32 key, address verifierAddress, uint256 tokenId) internal {
        Solution memory sol = Solution({used: true, verifierAddress: verifierAddress, tokenId: tokenId});
        solutions.push(sol);
        uniqueSolutions[key] = sol;

        emit SolutionAdded(key, verifierAddress, tokenId);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintVerify (
        address to,
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory inputs
    ) public {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, inputs));

        require(!uniqueSolutions[key].used, "solution is used before");
        require(verifyTx(a, b, c, inputs), "not valid proof");

        addSolution(key, msg.sender, tokenId);
        super.mint(to, tokenId);
    }
}

  


























