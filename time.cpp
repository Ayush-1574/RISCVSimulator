
// Branch Predictor implementation
class BranchPredictor {
    private:
        // Simple 2-bit saturating counter branch predictor
        struct BranchInfo {
            uint8_t counter;       // 2-bit counter: 0-1 predict not taken, 2-3 predict taken
            uint32_t target;       // Branch target address
        };
        
        unordered_map<uint32_t, BranchInfo> branch_table;
    
    public:
        BranchPredictor() {}
        
        // Predict whether branch will be taken
        bool predict(uint32_t branch_pc) {
            if (branch_table.find(branch_pc) == branch_table.end()) {
                // First encounter: Default predict not taken
                return false;
            }
            
            return branch_table[branch_pc].counter >= 2;
        }
        
        // Get the predicted target
        uint32_t get_target(uint32_t branch_pc) {
            if (branch_table.find(branch_pc) == branch_table.end()) {
                return branch_pc + 4;  // Default next PC
            }
            
            return branch_table[branch_pc].target;
        }
        
        // Update predictor based on actual outcome
        void update(uint32_t branch_pc, bool taken, uint32_t target) {
            if (branch_table.find(branch_pc) == branch_table.end()) {
                // First time seeing this branch
                branch_table[branch_pc] = {static_cast<unsigned char>(taken ? 2U : 0U), target};
            } else {
                // Update counter using 2-bit saturation
                if (taken) {
                    if (branch_table[branch_pc].counter < 3) {
                        branch_table[branch_pc].counter++;
                    }
                } else {
                    if (branch_table[branch_pc].counter > 0) {
                        branch_table[branch_pc].counter--;
                    }
                }
                
                // Update target
                branch_table[branch_pc].target = target;
            }
        }
    };
    