r = 0.5;
steps = 100;

P = runSim(r, steps);

days = 0:steps;
plot(days, P);
