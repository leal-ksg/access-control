# REQUIRES: tmux

# backend
tmux new-session -d -s dev -n backend
tmux send-keys -t dev:backend "cd backend && npm run dev" C-m

# frontend
tmux new-window -t dev:1 -n frontend
tmux sned-keys -t dev:frontend "cd frontend && npm run dev" C-m

# recover terminal
tmux attach-session -t dev