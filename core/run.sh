GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

show_progress() {
    local duration=$1
    local steps=20
    for ((i=0; i<=steps; i++)); do
        local progress=$((i*100/steps))
        printf "\r[%-20s] %d%%" "$(printf '=' %.0s $(seq 1 $i))" "$progress"
        sleep $(bc <<< "scale=2; $duration/$steps")
    done
    echo
}

run_command() {
    local command=$1
    local message=$2
    echo -e "${YELLOW}$message${NC}"
    if $command > /dev/null 2>&1; then
        show_progress 2
        echo -e "${GREEN}✓ Done${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
        exit 1
    fi
}

echo -e "${YELLOW}starting the actual runtime n' update process...${NC}"

run_command "npm i -g bun" "download runtime..."

run_command "bun update --latest" "everything must be new..."

echo -e "${GREEN}welcome abroad, unesa...${NC}"
echo "moshi moshi?"
bun run dev

echo -e "${YELLOW}localhost terminated. goodbye :)${NC}"