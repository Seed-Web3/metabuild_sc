
import { NearContract, NearBindgen, near, call, view, LookupMap, UnorderedMap, Vector, UnorderedSet } from 'near-sdk-js'
import { NFTContractMetadata, Token, TokenMetadata, internalNftMetadata } from './metadata';
import { internalMint } from './mint';
import { internalNftTokens, internalSupplyForOwner, internalTokensForOwner, internalTotalSupply} from './enumeration';
import { internalNftToken } from './nft_core';

/// This spec can be treated like a version of the standard.
export const NFT_METADATA_SPEC = "nft-1.0.0";

/// This is the name of the NFT standard we're using
export const NFT_STANDARD_NAME = "nep171";

@NearBindgen
export class Contract extends NearContract {
    owner_id: string;
    tokensPerOwner: LookupMap;
    tokensById: LookupMap;
    tokenMetadataById: UnorderedMap;
    metadata: NFTContractMetadata;

    timeCreated: number; //Time lock
    timePeriod: number;
    day = 1000 * 60 * 60 * 24 ;
    /*
        initialization function (can only be called once).
        this initializes the contract with metadata that was passed in and
        the owner_id. 
    */
    constructor({
        owner_id, 
        metadata = {
            spec: "glory-badge-1.0.0",
            name: "Seed Glory Badge",
            symbol: "SGB"
        },
        time_period = 1
    }) {
        super()
        this.owner_id = owner_id;
        this.tokensPerOwner = new LookupMap("tokensPerOwner");
        this.tokensById = new LookupMap("tokensById");
        this.tokenMetadataById = new UnorderedMap("tokenMetadataById");
        this.metadata = metadata;
        this.timeCreated = new Date().getTime();
        this.timePeriod = time_period;
    }

    default() {
        return new Contract({owner_id: ''})
    }

    /*
        MINT
    */
    @call
    nft_mint({ token_id, metadata, receiver_id, perpetual_royalties }) {
        //Check if the time of minting hasn't passed 1 day(default value)
        if(this.timeCreated + (this.timePeriod * this.day) < new Date().getTime()){
            near.log(`Minting is locked`);
            return ; 
        }
        //Check if the NFT has been minted before
        let token_list = internalTokensForOwner({ contract: this, accountId: receiver_id, fromIndex: "0", limit: 200 });
        let exists = false;
        token_list.map( (val,key) => {
            if(val["token_id"] === token_id){
                exists=true
             }
        })
        if(exists){
            near.log(`This NFT has already been minted before`);
            return ; 
        }
        return internalMint({ contract: this, tokenId: token_id, metadata: metadata, receiverId: receiver_id, perpetualRoyalties: perpetual_royalties });
    }

    /*
        BULK MINT
    */
    @call
    bulk_nft_mint({ token_id, metadata, perpetual_royalties, list}) {
        for(let i = 0 ; i<list.length; i++){
            this.nft_mint({ token_id: token_id+`-${i}`, metadata: metadata, receiver_id: list[i], perpetual_royalties: perpetual_royalties});
        }
    }

    /*
        CORE
    */
    @view
    //get the information for a specific token ID
    nft_token({ token_id }) {
        return internalNftToken({ contract: this, tokenId: token_id });
    }

    /*
        ENUMERATION
    */
    @view
    //Query for the total supply of NFTs on the contract
    nft_total_supply() {
        return internalTotalSupply({ contract: this });
    }

    @view
    //Query for nft tokens on the contract regardless of the owner using pagination
    nft_tokens({ from_index, limit }) {
        return internalNftTokens({ contract: this, fromIndex: from_index, limit: limit });
    }

    @view
    //get the total supply of NFTs for a given owner
    nft_tokens_for_owner({ account_id, from_index, limit }) {
        return internalTokensForOwner({ contract: this, accountId: account_id, fromIndex: from_index, limit: limit });
    }

    @view
    //Query for all the tokens for an owner
    nft_supply_for_owner({ account_id }) {
        return internalSupplyForOwner({ contract: this, accountId: account_id });
    }

    /*
        METADATA
    */
    @view
    //Query for all the tokens for an owner
    nft_metadata() {
        return internalNftMetadata({ contract: this });
    }
}